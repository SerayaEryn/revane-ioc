import { BeanFactoryPreProcessor } from './BeanFactoryPreProcessor.js'
import DefaultBeanDefinition from '../DefaultBeanDefinition.js'
import { Constructor } from '../Constructor.js'
import { BeanDefinition } from '../BeanDefinition.js'
import { pathWithEnding } from '../../revane-utils/FileUtil.js'

export class ModuleLoaderBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  async preProcess (beanDefinition: BeanDefinition): Promise<BeanDefinition[]> {
    if (beanDefinition.classConstructor == null) {
      beanDefinition.classConstructor = await this.getClass(beanDefinition)
    }
    return [beanDefinition]
  }

  private async getClass (entry: DefaultBeanDefinition): Promise<Constructor> {
    if (entry.instance != null) {
      return entry.instance
    }
    if (entry.path != null) {
      const Clazz = await import(pathWithEnding(entry.path, '.js'))
      if (entry.key != null) {
        return Clazz[entry.key]
      } else {
        if (Clazz.default != null) {
          return Clazz.default
        }
        return Clazz
      }
    }
    throw new Error(`no constructor or instance available for ${entry.id}`)
  }
}
