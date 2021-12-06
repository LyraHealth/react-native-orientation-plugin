import { withPlugins, createRunOncePlugin } from '@expo/config-plugins'
import { withOrientationIOS } from './withOrientationIOS'
import { withOrientationAndroid } from './withOrientationAndroid'
import { ConfigPlugin } from '@expo/config-plugins'

const pkg = { name: 'react-native-orientation', version: 'UNVERSIONED' }

const withOrientation: ConfigPlugin = (config, data: any) => {
  return withPlugins(config, [
    [withOrientationIOS, data],
    [withOrientationAndroid, data]
  ])
}
export default createRunOncePlugin(withOrientation, pkg.name, pkg.version)
