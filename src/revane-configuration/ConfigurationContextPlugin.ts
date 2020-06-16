import { ContextPlugin } from '../revane-ioc-core/context/ContextPlugin'
import { RevaneConfiguration, ConfigurationOptions } from './RevaneConfiguration'
import BeanDefinition from '../revane-ioc-core/BeanDefinition'
import { Configuration } from './Configuration'
import { ConfigurationProvider } from './ConfigurationProvider'

export class ConfigurationContextPlugin implements ContextPlugin, ConfigurationProvider {
  private options: ConfigurationOptions
  private configuration?: RevaneConfiguration = null

  constructor (options: ConfigurationOptions) {
    this.options = options
  }

  async plugin (
    beanDefinitions: BeanDefinition[]
  ): Promise<BeanDefinition[]> {
    if (beanDefinitions.filter((beanDefinition) => beanDefinition.id === 'configuration').length === 0 && !this.options.disabled) {
      this.configuration = new RevaneConfiguration(this.options)
      await this.configuration.init()
      const configuration = new BeanDefinition('configuration')
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
