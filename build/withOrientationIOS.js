"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withOrientationIOS = exports.addToPodFile = exports.addToAppDelegate = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
const addToAppDelegate = (src) => {
    const supportSrc = [
        `- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
    return [Orientation getOrientation];
  }`
    ];
    src = (0, utils_1.addLines)(src, '@implementation AppDelegate', 1, supportSrc);
    const lines = src.split('\n');
    lines.splice(1, 0, '#import "Orientation.h"');
    src = lines.join('\n');
    return src;
};
exports.addToAppDelegate = addToAppDelegate;
const withOrientationAppDelegate = (config) => {
    return (0, config_plugins_1.withAppDelegate)(config, config => {
        config.modResults.contents = (0, exports.addToAppDelegate)(config.modResults.contents);
        return config;
    });
};
const editPodfile = async (config, action) => {
    const podfilePath = path_1.default.join(config.modRequest.platformProjectRoot, 'Podfile');
    try {
        const podfile = action(await (0, utils_1.readFileAsync)(podfilePath));
        return await (0, utils_1.saveFileAsync)(podfilePath, podfile);
    }
    catch (e) {
        config_plugins_1.WarningAggregator.addWarningIOS('react-native-orientation-plugin', `Couldn't modify AppDelegate.m - ${e}.`);
    }
};
const addToPodFile = (src, relativePath) => {
    // Match both variations of Ruby config:
    // unknown: pod 'react-native-orientation', path: '../node_modules/react-native-orientation'
    if (!src.match(/pod ['"]react-native-orientation['"],\s?path: ['"][^'"]*node_modules\/react-native-orientation['"]/)) {
        src = (0, utils_1.addLines)(src, 'use_react_native', 0, [`  pod 'react-native-orientation', path: '${relativePath}'`]);
    }
    return src;
};
exports.addToPodFile = addToPodFile;
const withOrientationPodFile = (config) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        'ios',
        async (config) => {
            await editPodfile(config, podfile => {
                const packagePath = path_1.default.dirname(require.resolve(config.modRequest.projectRoot + '/node_modules/react-native-orientation/package.json'));
                const relativePath = path_1.default.relative(config.modRequest.platformProjectRoot, packagePath);
                podfile = (0, exports.addToPodFile)(podfile, relativePath);
                return podfile;
            });
            return config;
        }
    ]);
};
const withOrientationIOS = (config) => {
    config = withOrientationPodFile(config);
    config = withOrientationAppDelegate(config);
    return config;
};
exports.withOrientationIOS = withOrientationIOS;
