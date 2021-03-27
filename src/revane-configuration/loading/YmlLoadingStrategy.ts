import { LoadingStrategy } from './LoadingStrategy'
import { promises } from 'fs'
import { ConfigFileNotFound } from './ConfigFileNotFound'
import { load } from 'js-yaml'
import { replaceEnvironmentVariables } from './EnvironmentLoader'
import { deepMerge } from '../../revane-utils/Deepmerge'

const { readFile } = promises

export class YmlLoadingStrategy implements LoadingStrategy {
  async load (configDirectory: string, profile: string): Promise<object> {
    let buffer1: Buffer
    try {
      buffer1 = await readFile(`${configDirectory}/application.yml`)
    } catch (error) {
      throw new ConfigFileNotFound(`${configDirectory}/application.yml`)
    }
    const defaultConfig: object = load(replaceEnvironmentVariables(buffer1.toString()))
    let profileConfig: object
    try {
      const buffer2 = await readFile(`${configDirectory}/application-${profile}.yml`)
      profileConfig = load(replaceEnvironmentVariables(buffer2.toString()))
    } catch (ignore) {
      profileConfig = {}
    }
    return deepMerge(defaultConfig, profileConfig)
  }
}
