"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withOrientationAndroid = exports.mergeBuildGradle = exports.mergeSettingsGradle = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const utils_1 = require("./utils");
const mergeSettingsGradle = (contents) => {
    const settings = [
        "include ':react-native-orientation'",
        "project(':react-native-orientation').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-orientation/android')"
    ];
    return (0, utils_1.appendContents)({
        tag: 'react-native-orientation-plugin-settings-gradle',
        src: contents,
        newSrc: settings.join('\n'),
        comment: '//'
    }).contents;
};
exports.mergeSettingsGradle = mergeSettingsGradle;
const withSettingsGradleConfig = (config) => {
    return (0, config_plugins_1.withSettingsGradle)(config, config => {
        config.modResults.contents = (0, exports.mergeSettingsGradle)(config.modResults.contents);
        return config;
    });
};
const mergeBuildGradle = (contents) => {
    const dependency = [`      implementation project(':react-native-orientation')`];
    return (0, generateCode_1.mergeContents)({
        src: contents,
        newSrc: dependency.join('\n'),
        tag: 'react-native-orientation-plugin-dependency',
        comment: '//',
        anchor: /dependencies\s?{/,
        offset: 1
    }).contents;
};
exports.mergeBuildGradle = mergeBuildGradle;
const withBuildGradle = (config) => {
    return (0, config_plugins_1.withAppBuildGradle)(config, config => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents = (0, exports.mergeBuildGradle)(config.modResults.contents);
        }
        else {
            throw new Error('Cannot add orientation maven gradle because the build.gradle is not groovy');
        }
        return config;
    });
};
const withOrientationAndroid = (config) => {
    config = withBuildGradle(config);
    config = withSettingsGradleConfig(config);
    return config;
};
exports.withOrientationAndroid = withOrientationAndroid;
