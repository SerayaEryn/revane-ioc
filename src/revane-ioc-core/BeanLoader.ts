import DefaultBeanLoaderRegistry from './DefaultBeanLoaderRegistry'
import Options from './Options'
import Loader from './Loader'
import { BeanDefinition } from './BeanDefinition'

export default class BeanLoader {
  private beanResolverRegistry: DefaultBeanLoaderRegistry
  private loaders: Loader[]

  constructor (loaders: Loader[]) {
    this.loaders = loaders
    this.beanResolverRegistry = new DefaultBeanLoaderRegistry()
  }

  public getBeanDefinitions (options: Options): Promise<BeanDefinition[][]> {
    try {
      this.prepareBeanResolverRegistry(options)
      return this.beanResolverRegistry.get(options.loaderOptions, options.basePackage)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  private prepareBeanResolverRegistry (options: Options): void {
    for (const optionsForResolver of options.loaderOptions || []) {
      for (const loader of this.loaders) {
        if (loader.isRelevant(optionsForResolver)) {
          this.beanResolverRegistry.register(loader)
        }
      }
    }
  }
}
