import { LoadingStrategy } from './LoadingStrategy'
import { promises } from 'fs'
import { ConfigFileNotFound } from './ConfigFileNotFound'
import { replaceEnvironmentVariables } from './EnvironmentLoader'
import { deepMerge } from '../../revane-utils/Deepmerge'

const { readFile } = promises

export class JsonLoadingStrategy implements LoadingStrategy {
  async load (configDirectory: string, profile: string): Promise<object> {
    let buffer1: Buffer
    const configPath = `${configDirectory}/application.json`
    try {
      buffer1 = await readFile(configPath)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new ConfigFileNotFound(configPath)
    }
    const defaultConfig: object = JSON.parse(replaceEnvironmentVariables(buffer1.toString()))
    let profileConfig: object
    try {
      const buffer2 = await readFile(`${configDirectory}/application-${profile}.json`)
      profileConfig = JSON.parse(replaceEnvironmentVariables(buffer2.toString()))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      profileConfig = {}
    }
    return deepMerge(defaultConfig, profileConfig)
  }
}
