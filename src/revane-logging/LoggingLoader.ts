import { Loader, LoaderOptions, BeanDefinition } from '../revane-ioc/RevaneIOC'
import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition'
import { DefaultLogFactory } from './DefaultLogFactory'

export class LoggingLoader implements Loader {
  private readonly logFactory: DefaultLogFactory

  constructor (logFactory: DefaultLogFactory) {
    this.logFactory = logFactory
  }

  async load (
    options: LoaderOptions[]
  ): Promise<BeanDefinition[]> {
    const beanDefinition = new DefaultBeanDefinition('logFactory')
    beanDefinition.scope = 'singleton'
    beanDefinition.instance = this.logFactory
    return [beanDefinition]
  }

  type (): string {
    return 'logging'
  }
}
