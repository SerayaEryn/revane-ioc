import { BeanFactoryPreProcessor } from './BeanFactoryPreProcessor'
import BeanDefinition from '../BeanDefinition'

export class ModuleLoaderBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  async preProcess (beanDefinition: BeanDefinition): Promise<BeanDefinition[]> {
    beanDefinition.classConstructor = this.getClass(beanDefinition)
    return [ beanDefinition ]
  }

  private getClass (entry: BeanDefinition): any {
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
    return null
  }
}
