import { BeanFactoryPreProcessor } from '../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js'
import { configurationPropertiesSym } from './Symbols.js'
import { BeanDefinition } from '../revane-ioc-core/BeanDefinition.js'

export class ConfigurationPropertiesPreProcessor implements BeanFactoryPreProcessor {
  async preProcess (beanDefinition: BeanDefinition): Promise<BeanDefinition[]> {
    if (beanDefinition.classConstructor != null) {
      const configurationProperties = Reflect.getMetadata(
        configurationPropertiesSym,
        beanDefinition.classConstructor
      )
      beanDefinition.configurationProperties = configurationProperties
    }
    return [beanDefinition]
  }
}
