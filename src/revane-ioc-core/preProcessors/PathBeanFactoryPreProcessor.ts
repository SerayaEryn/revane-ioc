import { BeanFactoryPreProcessor } from './BeanFactoryPreProcessor'
import DefaultBeanDefinition from '../DefaultBeanDefinition'
import Options from '../Options'
import { join } from 'path'

export class PathBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  private readonly options: Options

  constructor (options: Options) {
    this.options = options
  }

  public async preProcess (beanDefinition: DefaultBeanDefinition): Promise<DefaultBeanDefinition[]> {
    if (beanDefinition.class != null) {
      beanDefinition.path = this.getPath(beanDefinition)
    }
    return [beanDefinition]
  }

  private getPath (beanDefinition: DefaultBeanDefinition): string {
    if (!this.isRelative(beanDefinition) || this.isAbsolute(beanDefinition)) {
      return beanDefinition.class
    }
    return join(this.options.basePackage, beanDefinition.class)
  }

  private isAbsolute (beanDefinition: DefaultBeanDefinition): boolean {
    return beanDefinition.class.startsWith('/')
  }

  private isRelative (beanDefinition: DefaultBeanDefinition): boolean {
    return beanDefinition.class.startsWith('.')
  }
}
