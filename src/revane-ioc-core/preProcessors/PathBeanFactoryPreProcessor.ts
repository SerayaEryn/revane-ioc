import { BeanFactoryPreProcessor } from './BeanFactoryPreProcessor'
import BeanDefinition from '../BeanDefinition'
import Options from '../Options'
import { join } from 'path'

export class PathBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  private options: Options

  constructor (options: Options) {
    this.options = options
  }

  public async preProcess (beanDefinition: BeanDefinition): Promise<BeanDefinition[]> {
    if (beanDefinition.class) {
      beanDefinition.path = this.getPath(beanDefinition)
    }
    return [ beanDefinition ]
  }

  private getPath (beanDefinition: BeanDefinition): string {
    if (!this.isRelative(beanDefinition) || this.isAbsolute(beanDefinition)) {
      return beanDefinition.class
    }
    return join(this.options.basePackage, beanDefinition.class)
  }

  private isAbsolute (beanDefinition: BeanDefinition): boolean {
    return beanDefinition.class.startsWith('/')
  }

  private isRelative (beanDefinition: BeanDefinition): boolean {
    return beanDefinition.class.startsWith('.')
  }
}
