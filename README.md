# react-native-orientation-plugin

An expo config plugin created to insert native code into the compiled ios/android app and allow react-native-orientation to work with EAS build
## Setup
`npm install react-native-orientation`

`npm install react-native-orientation-plugin`

Add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": ["react-native-orientation-plugin"]
  }
}
```

Usage:

```javscript
import Orientation from 'react-native-orientation';

Orientation.lockToPortrait();
```

Reference [react-native-orientation](https://github.com/yamill/react-native-orientation) library for more documentation.