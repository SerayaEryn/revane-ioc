import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import Bean from '../revane-ioc-core/context/bean/Bean'
import BeanDefinition from '../revane-ioc-core/BeanDefinition'
import { Configuration } from './Configuration'

export class ConfigurationPropertiesPostProcessor implements BeanFactoryPostProcessor {
  private configuration: Configuration

  constructor (configuration: Configuration) {
    this.configuration = configuration
  }

  async postProcess (beanDefinition: BeanDefinition, bean: Bean): Promise<Bean[]> {
    await bean.executeOnInstance(async (instance: any) => {
      const configurationPropertyValues = {}
      if (this.configuration != null) {
        const configurationProperties = beanDefinition.configurationProperties
        if (configurationProperties) {
          for (const configurationProperty of configurationProperties.properties || []) {
            const key = configurationProperties.prefix + '.' + configurationProperty
            if (this.configuration.has(key)) {
              configurationPropertyValues[configurationProperty] = this.configuration.get(key)
            }
          }
        }
      }
      for (const key of Object.keys(configurationPropertyValues || {})) {
        instance[key] = configurationPropertyValues[key]
      }
    })
    return [ bean ]
  }
}