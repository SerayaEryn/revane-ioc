import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import Bean from '../revane-ioc-core/context/bean/Bean'
import { Configuration } from './Configuration'
import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'

export class ConfigurationPropertiesPostProcessor implements BeanFactoryPostProcessor {
  private readonly configuration: Configuration

  constructor (configuration: Configuration) {
    this.configuration = configuration
  }

  async postProcess (beanDefinition: BeanDefinition, bean: Bean): Promise<Bean[]> {
    await bean.executeOnInstance(async (instance: any) => {
      const values: { [key: string]: any } = {}
      if (this.configuration != null) {
        const { configurationProperties } = beanDefinition
        if (configurationProperties != null) {
          for (const propertyName of configurationProperties.properties ?? []) {
            const key = `${configurationProperties.prefix}.${propertyName}`
            if (this.configuration.has(key)) {
              values[propertyName] = this.configuration.get(key)
            }
          }
        }
      }
      for (const key of Object.keys(values)) {
        instance[key] = values[key]
      }
    })
    return [bean]
  }
}
