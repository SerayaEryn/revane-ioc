import { Loader, LoaderOptions, BeanDefinition } from '../revane-ioc/RevaneIOC.js'
import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition.js'
import { DefaultLogFactory } from './DefaultLogFactory.js'

export class LoggingLoader implements Loader {
  private readonly logFactory: DefaultLogFactory

  constructor (logFactory: DefaultLogFactory) {
    this.logFactory = logFactory
  }

  async load (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
