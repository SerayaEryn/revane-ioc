import DefaultBeanLoaderRegistry from './DefaultBeanLoaderRegistry'
import Options from './Options'
import Loader from './Loader'
import { BeanDefinition } from './BeanDefinition'

export default class BeanLoader {
  private readonly beanResolverRegistry: DefaultBeanLoaderRegistry
  private readonly loaders: Loader[]

  constructor (loaders: Loader[]) {
    this.loaders = loaders
    this.beanResolverRegistry = new DefaultBeanLoaderRegistry()
  }

  public async getBeanDefinitions (options: Options): Promise<BeanDefinition[][]> {
    this.prepareBeanResolverRegistry(options)
    return await this.beanResolverRegistry.get(options.loaderOptions, options.basePackage)
  }

  private prepareBeanResolverRegistry (options: Options): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    for (const optionsForResolver of options.loaderOptions || []) {
      for (const loader of this.loaders) {
        if (loader.isRelevant(optionsForResolver)) {
          this.beanResolverRegistry.register(loader)
        }
      }
    }
  }
}
