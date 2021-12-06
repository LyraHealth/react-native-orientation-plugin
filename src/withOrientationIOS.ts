import { withDangerousMod, ExportedConfigWithProps, WarningAggregator, withAppDelegate } from '@expo/config-plugins'
import { addLines, readFileAsync, saveFileAsync } from './utils'
import { ConfigPlugin } from '@expo/config-plugins'

import path from 'path'

export const addToAppDelegate = (src: string) => {
  const supportSrc = [
    `- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
    return [Orientation getOrientation];
  }`
  ]
  src = addLines(src, '@implementation AppDelegate', 1, supportSrc)
  const lines = src.split('\n')
  lines.splice(1, 0, '#import "Orientation.h"')
  src = lines.join('\n')
  return src
}

const withOrientationAppDelegate: ConfigPlugin = (config) => {
  return withAppDelegate(config, config => {
    config.modResults.contents = addToAppDelegate(config.modResults.contents)
    return config
  })
}

const editPodfile = async (config: ExportedConfigWithProps, action: (podfile: string) => string) => {
  const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile')
  try {
    const podfile = action(await readFileAsync(podfilePath))
    return await saveFileAsync(podfilePath, podfile)
  } catch (e) {
    WarningAggregator.addWarningIOS('react-native-orientation-plugin', `Couldn't modify AppDelegate.m - ${e}.`)
  }
}

export const addToPodFile = (src: string, relativePath: string) => {
  // Match both variations of Ruby config:
  // unknown: pod 'react-native-orientation', path: '../node_modules/react-native-orientation'
  if (
    !src.match(/pod ['"]react-native-orientation['"],\s?path: ['"][^'"]*node_modules\/react-native-orientation['"]/)
  ) {
    src = addLines(src, 'use_react_native', 0, [`  pod 'react-native-orientation', path: '${relativePath}'`])
  }
  return src
}

const withOrientationPodFile: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'ios',
    async config => {
      await editPodfile(config, podfile => {
        const packagePath = path.dirname(
          require.resolve(config.modRequest.projectRoot + '/node_modules/react-native-orientation/package.json')
        )
        const relativePath = path.relative(config.modRequest.platformProjectRoot, packagePath)
        podfile = addToPodFile(podfile, relativePath)
        return podfile
      })
      return config
    }
  ])
}

export const withOrientationIOS: ConfigPlugin = (config) => {
  config = withOrientationPodFile(config)
  config = withOrientationAppDelegate(config)
  return config
}
