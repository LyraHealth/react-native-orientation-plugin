import { withAppBuildGradle, withSettingsGradle, ConfigPlugin } from '@expo/config-plugins'
import { mergeContents } from '@expo/config-plugins/build/utils/generateCode'
import { appendContents } from './utils'

export const mergeSettingsGradle = (contents: string) => {
  const settings = [
    "include ':react-native-orientation'",
    "project(':react-native-orientation').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-orientation/android')"
  ]
  return appendContents({
    tag: 'react-native-orientation-plugin-settings-gradle',
    src: contents,
    newSrc: settings.join('\n'),
    comment: '//'
  }).contents
}

const withSettingsGradleConfig: ConfigPlugin = (config) => {
  return withSettingsGradle(config, config => {
    config.modResults.contents = mergeSettingsGradle(config.modResults.contents)
    return config
  })
}

export const mergeBuildGradle = (contents: string) => {
  const dependency = [`      implementation project(':react-native-orientation')`]
  return mergeContents({
    src: contents,
    newSrc: dependency.join('\n'),
    tag: 'react-native-orientation-plugin-dependency',
    comment: '//',
    anchor: /dependencies\s?{/,
    offset: 1
  }).contents
}

const withBuildGradle: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, config => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = mergeBuildGradle(config.modResults.contents)
    } else {
      throw new Error('Cannot add orientation maven gradle because the build.gradle is not groovy')
    }
    return config
  })
}

export const withOrientationAndroid: ConfigPlugin = (config) => {
  config = withBuildGradle(config)
  config = withSettingsGradleConfig(config)

  return config
}
