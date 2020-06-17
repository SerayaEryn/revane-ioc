import { ContextPlugin } from '../revane-ioc-core/context/ContextPlugin'
import { RevaneConfiguration, ConfigurationOptions } from './RevaneConfiguration'
import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition'
import { Configuration } from './Configuration'
import { ConfigurationProvider } from './ConfigurationProvider'

export class ConfigurationContextPlugin implements ContextPlugin, ConfigurationProvider {
  private options: ConfigurationOptions
  private configuration?: RevaneConfiguration = null

  constructor (options: ConfigurationOptions, configuration: RevaneConfiguration) {
    this.options = options
    this.configuration = configuration
  }

  async plugin (
    beanDefinitions: DefaultBeanDefinition[]
  ): Promise<DefaultBeanDefinition[]> {
    if (beanDefinitions.filter((beanDefinition) => beanDefinition.id === 'configuration').length === 0 && !this.options.disabled) {
      const configuration = new DefaultBeanDefinition('configuration')
      configuration.instance = this.configuration
      configuration.scope = 'singleton'
      beanDefinitions.push(configuration)
    }
    return beanDefinitions
  }

  provide (): Configuration | null {
    return this.configuration
  }
}
