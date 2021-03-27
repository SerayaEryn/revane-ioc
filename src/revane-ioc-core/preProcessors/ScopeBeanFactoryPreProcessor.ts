import { BeanFactoryPreProcessor } from './BeanFactoryPreProcessor'
import Options from '../Options'
import { BeanDefinition } from '../BeanDefinition'

export class ScopeBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  private readonly options: Options

  constructor (options: Options) {
    this.options = options
  }

  async preProcess (beanDefinition: BeanDefinition): Promise<BeanDefinition[]> {
    beanDefinition.scope = beanDefinition.scope ?? this.options.defaultScope ?? 'singleton'
    return [beanDefinition]
  }
}
