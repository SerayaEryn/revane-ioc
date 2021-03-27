import { BeanFactoryPreProcessor } from '../revane-ioc-core/preProcessors/BeanFactoryPreProcessor'
import { configurationPropertiesSym } from './Symbols'
import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'
import { Reflect } from '../revane-utils/Reflect'

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
