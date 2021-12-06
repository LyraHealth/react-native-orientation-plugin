import { addToPodFile, addToAppDelegate } from '../withOrientationIOS'
import fs from 'fs'
import path from 'path'

describe(addToPodFile, () => {
  it(`modifies the PodFile file for react-native-orientation-plugin`, () => {
    const fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'PodFile'), 'utf8')
    expect(addToPodFile(fixture, '../node_modules/react-native-orientation')).toMatchSnapshot()
  })
})

describe(addToAppDelegate, () => {
  it('modifies the AppDelegate for react-native-orientation-plugin', () => {
    const fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'AppDelegate.m'), 'utf8')
    expect(addToAppDelegate(fixture)).toMatchSnapshot()
  })
})
