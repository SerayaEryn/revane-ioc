import { promises } from 'fs'
import { deepMerge } from '../../revane-utils/Deepmerge'
import { ConfigFileNotFound } from './ConfigFileNotFound'
import { replaceEnvironmentVariables } from './EnvironmentLoader'
import { LoadingStrategy } from './LoadingStrategy'

const { readFile } = promises

export class PropertiesLoadingStrategy implements LoadingStrategy {
  public async load (configDirectory: string, profile: string): Promise<object> {
    let buffer1: Buffer
    try {
      buffer1 = await readFile(`${configDirectory}/application.properties`)
    } catch (error) {
      throw new ConfigFileNotFound(`${configDirectory}/application.properties`)
    }
    const defaultConfig: object = this.parseProperties(replaceEnvironmentVariables(buffer1.toString()))
    let profileConfig: object
    try {
      const buffer2 = await readFile(`${configDirectory}/application-${profile}.properties`)
      profileConfig = this.parseProperties(replaceEnvironmentVariables(buffer2.toString()))
    } catch (ignore) {
      profileConfig = {}
    }
    return deepMerge(defaultConfig, profileConfig)
  }

  private parseProperties (content: string): object {
    const lines = content.split('\n')
    const config = {}
    let current = null
    for (const line of lines) {
      current = config
      const index = line.indexOf('=')
      const key = line.substring(0, index)
      const value = line.substring(index + 1)
      const keyParts = key.split('.')
      for (let index = 0; index < keyParts.length; index++) {
        const keyPart = keyParts[index]
        if (current[keyPart] == null && index !== keyParts.length - 1) {
          current[keyPart] = {}
          current = current[keyPart]
        } else if (current[keyPart] == null && index === keyParts.length - 1) {
          current[keyPart] = this.parseValue(value)
        } else {
          current = current[keyPart]
        }
      }
    }
    return config
  }

  private parseValue (value: string): any {
    if (value.trim() === 'true') return true
    if (value.trim() === 'false') return false
    if (!Number.isNaN(Number.parseFloat(value.trim()))) return Number.parseFloat(value.trim())
    if (!Number.isNaN(Number.parseInt(value.trim()))) return Number.parseInt(value.trim())
    return value
  }
}
