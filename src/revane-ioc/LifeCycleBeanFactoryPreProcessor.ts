import { Reflect } from '../revane-utils/Reflect'
import { BeanFactoryPreProcessor } from '../revane-ioc-core/preProcessors/BeanFactoryPreProcessor'
import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'

export class LifeCycleBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  async preProcess (
    beanDefinition: BeanDefinition,
    beanDefinitions: BeanDefinition[]
  ): Promise<BeanDefinition[]> {
    beanDefinition.postConstructKey = this.postConstructKey(beanDefinition)
    beanDefinition.preDestroyKey = this.preDestroyKey(beanDefinition)
    return [beanDefinition]
  }

  private postConstructKey (beanDefinition: BeanDefinition): string | null {
    if (beanDefinition.classConstructor == null) return null
    return Reflect.getMetadata(
      'life-cycle:postConstruct',
      beanDefinition.classConstructor.prototype
    )?.propertyKey
  }

  private preDestroyKey (beanDefinition: BeanDefinition): string | null {
    if (beanDefinition.classConstructor == null) return null
    return Reflect.getMetadata(
      'life-cycle:preDestroy',
      beanDefinition.classConstructor.prototype
    )?.propertyKey
  }
}
