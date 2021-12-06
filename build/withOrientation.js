"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withOrientationIOS_1 = require("./withOrientationIOS");
const withOrientationAndroid_1 = require("./withOrientationAndroid");
const pkg = { name: 'react-native-orientation', version: 'UNVERSIONED' };
const withOrientation = (config, data) => {
    return (0, config_plugins_1.withPlugins)(config, [
        [withOrientationIOS_1.withOrientationIOS, data],
        [withOrientationAndroid_1.withOrientationAndroid, data]
    ]);
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withOrientation, pkg.name, pkg.version);
