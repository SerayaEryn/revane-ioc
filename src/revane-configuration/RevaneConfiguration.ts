import { LoadingStrategy } from './loading/LoadingStrategy'
import { JsonLoadingStrategy } from './loading/JsonLoadingStrategy'
import { Configuration } from '../revane-ioc-core/context/Configuration'

export class ConfigurationOptions {
  profile: string
  directory: string
  required: boolean
  disabled: boolean

  constructor (
    profile: string,
    directory: string,
    required: boolean,
    disabled: boolean
  ) {
    this.profile = profile
    this.directory = directory
    this.required = required || false
    this.disabled = disabled || false
  }
}

export class RevaneConfiguration implements Configuration {
  private loadingStrategies: LoadingStrategy[]
  private values: object
  private options: ConfigurationOptions

  constructor (options: ConfigurationOptions) {
    this.options = options
    this.loadingStrategies = [
      new JsonLoadingStrategy()
      // new YamlLoadingStrategy(),
      // new PropertiesLoadingStragegy()
    ]
  }

  public async init () {
    for (const strategy of this.loadingStrategies) {
      try {
        const { directory: configDirectory, profile } = this.options
        this.values = await strategy.load(configDirectory, profile)
        return
      } catch (ignore) {
        // ignore
      }
    }
    if (this.options.required) {
      throw new Error('No configuration files found')
    }
  }

  public get (key: string): any {
    const parts = key.split('.')
    let values = this.values
    for (const part of parts) {
      if (!values) {
        throw new Error(`propery ${key} not present in configuration!`)
      }
      values = values[part]
    }
    return values
  }

  public getString (key: string): string {
    const value = this.get(key)
    if (typeof value !== 'string') {
      throw new Error(`the key ${key} is not a string`)
    }
    return value
  }

  public getBoolean (key: string): boolean {
    const value = this.get(key)
    if (typeof value !== 'boolean') {
      throw new Error(`the key ${key} is not a boolean`)
    }
    return value
  }

  public getNumber (key: string): number {
    const value = this.get(key)
    if (typeof value !== 'number') {
      throw new Error(`the key ${key} is not a number`)
    }
    return value
  }

  public has (key: string): boolean {
    const parts = key.split('.')
    let values = this.values
    for (const part of parts) {
      if (!values) {
        return false
      }
      values = values[part]
    }
    return values != null
  }
}
