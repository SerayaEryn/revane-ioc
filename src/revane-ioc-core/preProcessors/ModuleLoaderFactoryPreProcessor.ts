import { BeanFactoryPreProcessor } from './BeanFactoryPreProcessor'
import DefaultBeanDefinition from '../DefaultBeanDefinition'
import { Constructor } from '../Constructor'

export class ModuleLoaderBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  async preProcess (beanDefinition: DefaultBeanDefinition): Promise<DefaultBeanDefinition[]> {
    beanDefinition.classConstructor = this.getClass(beanDefinition)
    return [beanDefinition]
  }

  private getClass (entry: DefaultBeanDefinition): Constructor {
    if (entry.instance != null) {
      return entry.instance
    }
    if (entry.path != null) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Clazz = require(entry.path)
      if (Clazz.default != null) {
        return Clazz.default
      }
      return Clazz
    }
    throw new Error(`no constructor or instance available for ${entry.id}`)
  }
}
