import { Reflect } from '../revane-utils/Reflect'
import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'
import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import Bean from '../revane-ioc-core/context/bean/Bean'

export class LifeCycleBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
  async postProcess (beanDefinition: BeanDefinition, bean: Bean, instance: any): Promise<void> {
    beanDefinition.postConstructKey = this.postConstructKey(instance)
    beanDefinition.preDestroyKey = this.preDestroyKey(instance)
  }

  private postConstructKey (instance: any): string | null {
    return Reflect.getMetadata(
      'life-cycle:postConstruct',
      instance.constructor.prototype
    )?.propertyKey
  }

  private preDestroyKey (instance: any): string | null {
    return Reflect.getMetadata(
      'life-cycle:preDestroy',
      instance.constructor.prototype
    )?.propertyKey
  }
}
