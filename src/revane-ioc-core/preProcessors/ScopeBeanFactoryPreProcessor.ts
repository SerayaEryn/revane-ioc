import { BeanFactoryPreProcessor } from './BeanFactoryPreProcessor'
import Options from '../Options'
import { BeanDefinition } from '../BeanDefinition'

export class ScopeBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  private readonly options: Options

  constructor (options: Options) {
    this.options = options
  }

  async preProcess (beanDefinition: BeanDefinition): Promise<BeanDefinition[]> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    beanDefinition.scope = beanDefinition.scope || this.options.defaultScope
    return [beanDefinition]
  }
}
