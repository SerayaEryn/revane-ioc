import { LoadingStrategy } from './LoadingStrategy'
import { promises } from 'fs'
import { ConfigFileNotFound } from './ConfigFileNotFound'
import { parse } from 'yaml'
import { replaceEnvironmentVariables } from './EnvironmentLoader'
import { deepMerge } from '../../revane-utils/Deepmerge'

const { readFile } = promises

export class YmlLoadingStrategy implements LoadingStrategy {
  async load (configDirectory: string, profile: string): Promise<any> {
    let buffer1: Buffer
    try {
      buffer1 = await readFile(`${configDirectory}/application.yml`)
    } catch (_) {
      throw new ConfigFileNotFound(`${configDirectory}/application.yml`)
    }
    const defaultConfig: object = parse(replaceEnvironmentVariables(buffer1.toString()))
    let profileConfig: object
    try {
      const buffer2 = await readFile(`${configDirectory}/application-${profile}.yml`)
      profileConfig = parse(replaceEnvironmentVariables(buffer2.toString()))
    } catch (_) {
      return defaultConfig
    }
    return deepMerge(defaultConfig, profileConfig)
  }
}
