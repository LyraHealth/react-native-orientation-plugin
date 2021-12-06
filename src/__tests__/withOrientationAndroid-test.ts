import { mergeBuildGradle, mergeSettingsGradle } from '../withOrientationAndroid'
import fs from 'fs'
import path from 'path'

describe(mergeBuildGradle, () => {
  it(`modifies the build.gradle file`, () => {
    const fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'build.gradle'), 'utf8')
    expect(mergeBuildGradle(fixture)).toMatchSnapshot()
  })
})

describe(mergeSettingsGradle, () => {
  it('modifies the settings gradle file', () => {
    const fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'settings.gradle'), 'utf8')
    expect(mergeSettingsGradle(fixture)).toMatchSnapshot()
  })
})
