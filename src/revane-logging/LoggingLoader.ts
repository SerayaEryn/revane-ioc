import { Loader, LoaderOptions, BeanDefinition } from '../revane-ioc/RevaneIOC'
import { DefaultLogFactory, LoggingOptions } from './RevaneLogging'
import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition'

export class LoggingLoader implements Loader {
  private readonly logFactory: DefaultLogFactory

  constructor (options: LoggingOptions) {
    this.logFactory = new DefaultLogFactory(options)
  }

  async load (
    options: LoaderOptions,
    basePackage: string
  ): Promise<BeanDefinition[]> {
    const beanDefinition = new DefaultBeanDefinition('logFactory')
    beanDefinition.scope = 'singleton'
    beanDefinition.instance = this.logFactory
    return [beanDefinition]
  }

  type (): string {
    return 'logging'
  }

  isRelevant (options: LoaderOptions): boolean {
    return options.file === 'logging'
  }
}
