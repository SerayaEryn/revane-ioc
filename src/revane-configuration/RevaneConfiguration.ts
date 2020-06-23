import { LoadingStrategy } from './loading/LoadingStrategy'
import { Configuration } from './Configuration'
import { NoConfigFilesFound } from './NoConfigFilesFound'
import { KeyNotPresentInConfig } from './KeyNotPresentInConfig'
import { TypeMismatch } from './TypeMismatch'
import { deepMerge } from '../revane-utils/Deepmerge'

export class ConfigurationOptions {
  profile: string
  directory: string
  required: boolean
  disabled: boolean
  strategies: LoadingStrategy[]

  constructor (
    profile: string,
    directory: string,
    required: boolean,
    disabled: boolean,
    strategies: LoadingStrategy[]
  ) {
    this.profile = profile
    this.directory = directory
    this.required = required || false
    this.disabled = disabled || false
    this.strategies = strategies
  }
}

export class RevaneConfiguration implements Configuration {
  private values: object = {}
  private readonly options: ConfigurationOptions

  constructor (options: ConfigurationOptions) {
    this.options = options
  }

  public async init (): Promise<void> {
    for (const strategy of this.options.strategies) {
      let loadedValues: object = {}
      try {
        const { directory: configDirectory, profile } = this.options
        loadedValues = await strategy.load(configDirectory, profile)
        this.values = deepMerge(this.values, loadedValues)
        loadedValues = {}
      } catch (error) {
        if (error.code !== 'REV_ERR_CONFIG_FILE_NOT_FOUND') {
          throw error
        }
      }
    }
    if (this.options.required) {
      throw new NoConfigFilesFound()
    }
  }

  public get (key: string): any {
    const parts = key.split('.')
    let values = this.values
    for (const part of parts) {
      if (values == null) {
        throw new KeyNotPresentInConfig(key)
      }
      values = values[part]
    }
    return values
  }

  public getString (key: string): string {
    const value = this.get(key)
    if (typeof value !== 'string') {
      throw new TypeMismatch(key, 'string')
    }
    return value
  }

  public getBoolean (key: string): boolean {
    const value = this.get(key)
    if (typeof value !== 'boolean') {
      throw new TypeMismatch(key, 'boolean')
    }
    return value
  }

  public getNumber (key: string): number {
    const value = this.get(key)
    if (typeof value !== 'number') {
      throw new TypeMismatch(key, 'number')
    }
    return value
  }

  public has (key: string): boolean {
    const parts = key.split('.')
    let values = this.values
    for (const part of parts) {
      if (values == null) {
        return false
      }
      values = values[part]
    }
    return values != null
  }
}
