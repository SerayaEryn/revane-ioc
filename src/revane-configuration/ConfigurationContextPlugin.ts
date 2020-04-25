import { ContextPlugin } from '../revane-ioc-core/context/ContextPlugin'
import { RevaneConfiguration, ConfigurationOptions } from './RevaneConfiguration'
import BeanDefinition from '../revane-ioc-core/BeanDefinition'
import { BeanProvider } from '../revane-ioc-core/context/BeanProvider'
import { Configuration } from '../revane-ioc-core/context/Configuration'
import { ConfigurationProvider } from '../revane-ioc-core/context/ConfigurationProvider'

export class ConfigurationContextPlugin implements ContextPlugin, ConfigurationProvider {
  private options: ConfigurationOptions
  private configuration?: RevaneConfiguration = null

  constructor (options: ConfigurationOptions) {
    this.options = options
  }

  async plugin (
    beanDefinitions: Map<string, BeanDefinition>,
    beanProvider: BeanProvider
  ): Promise<Map<string, BeanDefinition>> {
    if (!beanDefinitions.has('configuration') && !this.options.disabled) {
      const configuration = new BeanDefinition('configuration')
      configuration.instance = this.configuration
      configuration.scope = 'singleton'
      beanDefinitions.set('configuration', configuration)
    }
    return beanDefinitions
  }

  provide (): Configuration | null {
    return this.configuration
  }

  async init () {
    this.configuration = new RevaneConfiguration(this.options)
    await this.configuration.init()
  }
}
