import { BeanFactoryPreProcessor } from '../revane-ioc-core/preProcessors/BeanFactoryPreProcessor'
import { configurationPropertiesSym } from './Symbols'
import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'

export class ConfigurationPropertiesPreProcessor implements BeanFactoryPreProcessor {
  async preProcess (beanDefinition: BeanDefinition): Promise<BeanDefinition[]> {
    const configurationProperties = Reflect.getMetadata(configurationPropertiesSym, beanDefinition.classConstructor)
    beanDefinition.configurationProperties = configurationProperties
    return [ beanDefinition ]
  }
}
