import { LoadingStrategy } from './LoadingStrategy'
import { promises } from 'fs'
import { ConfigFileNotFound } from './ConfigFileNotFound'
import { safeLoad } from 'js-yaml'
import { replaceEnvironmentVariables } from './EnvironmentLoader'
import { deepMerge } from '../../revane-utils/Deepmerge'

const { readFile } = promises

export class YmlLoadingStrategy implements LoadingStrategy {
  async load (configDirectory: string, profile: string): Promise<object> {
    let buffer1
    try {
      buffer1 = await readFile(`${configDirectory}/application.yml`)
    } catch (error) {
      throw new ConfigFileNotFound(`${configDirectory}/application.yml`)
    }
    const defaultConfig = safeLoad(replaceEnvironmentVariables(buffer1.toString()))
    let profileConfig
    try {
      const buffer2 = await readFile(`${configDirectory}/application-${profile}.yml`)
      profileConfig = safeLoad(replaceEnvironmentVariables(buffer2.toString()))
    } catch (ignore) {
      profileConfig = {}
    }
    return deepMerge(defaultConfig, profileConfig)
  }
}
