import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor.js'
import Bean from '../revane-ioc-core/context/bean/Bean.js'
import { Configuration } from './Configuration.js'
import { BeanDefinition } from '../revane-ioc-core/BeanDefinition.js'

export class ConfigurationPropertiesPostProcessor implements BeanFactoryPostProcessor {
  private readonly configuration: Configuration

  constructor (configuration: Configuration) {
    this.configuration = configuration
  }

  async postProcess (beanDefinition: BeanDefinition, bean: Bean, instance: any): Promise<void> {
    const values: Record<string, any> = {}
    if (this.configuration != null) {
      const { configurationProperties } = beanDefinition
      if (configurationProperties != null) {
        for (const propertyName of configurationProperties.properties ?? []) {
          const key = `${configurationProperties.prefix}.${propertyName}`
          if (this.configuration.has(key)) {
            values[propertyName] = this.configuration.get(key)
          }
        }
        for (const propertyName of configurationProperties.setters ?? []) {
          const propertyKey = propertyName.substring(3, 4).toLowerCase() + propertyName.substring(4)
          const key = `${configurationProperties.prefix}.${propertyKey}`
          if (this.configuration.has(key)) {
            instance[propertyName](this.configuration.get(key))
          }
        }
      }
    }
    for (const key of Object.keys(values)) {
      instance[key] = values[key]
    }
  }
}
