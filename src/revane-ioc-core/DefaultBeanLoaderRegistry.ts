import Loader from './Loader'
import BeanLoaderRegistry from './BeanLoaderRegistry'
import { LoaderOptions } from '../revane-ioc/RevaneIOC'
import { BeanDefinition } from './BeanDefinition'

export default class DefaultBeanLoaderRegistry implements BeanLoaderRegistry {
  private readonly loaders: Loader[] = []

  public register (loader: Loader): void {
    this.loaders.push(loader)
  }

  public async get (loaderOptions: LoaderOptions[], basePackage: string): Promise<BeanDefinition[][]> {
    const promises: any[] = []
    for (let index = 0; index < this.loaders.length; index++) {
      promises.push(this.loaders[index].load(loaderOptions[index], basePackage))
    }
    return await Promise.all(promises)
  }
}
