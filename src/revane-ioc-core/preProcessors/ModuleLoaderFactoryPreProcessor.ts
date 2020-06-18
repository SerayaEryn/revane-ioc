import { BeanFactoryPreProcessor } from './BeanFactoryPreProcessor'
import DefaultBeanDefinition from '../DefaultBeanDefinition'

export class ModuleLoaderBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  async preProcess (beanDefinition: DefaultBeanDefinition): Promise<DefaultBeanDefinition[]> {
    beanDefinition.classConstructor = this.getClass(beanDefinition)
    return [ beanDefinition ]
  }

  private getClass (entry: DefaultBeanDefinition): any {
    if (entry.instance) {
      return entry.instance
    }
    if (entry.path) {
      const Clazz = require(entry.path)
      if (Clazz.default) {
        return Clazz.default
      }
      return Clazz
    }
    throw new Error(`no constructor or instance available for ${entry.id}`)
  }
}
