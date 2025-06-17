import { BeanFactoryPreProcessor } from './BeanFactoryPreProcessor.js'
import Options from '../Options.js'
import { BeanDefinition } from '../BeanDefinition.js'
import { Scopes } from '../../revane-ioc/RevaneIOC.js'

export class ScopeBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  private readonly options: Options

  constructor (options: Options) {
    this.options = options
  }

  async preProcess (beanDefinition: BeanDefinition): Promise<BeanDefinition[]> {
    beanDefinition.scope = beanDefinition.scope ?? this.options.defaultScope ?? Scopes.SINGLETON
    return [beanDefinition]
  }
}
