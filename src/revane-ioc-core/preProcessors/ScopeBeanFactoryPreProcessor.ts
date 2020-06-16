import { BeanFactoryPreProcessor } from './BeanFactoryPreProcessor'
import BeanDefinition from '../BeanDefinition'
import Options from '../Options'

export class ScopeBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  private options: Options

  constructor (options: Options) {
    this.options = options
  }

  async preProcess (beanDefinition: BeanDefinition): Promise<BeanDefinition[]> {
    beanDefinition.scope = beanDefinition.scope || this.options.defaultScope
    return [ beanDefinition ]
  }
}
