import Loader from './Loader'
import { LoaderOptions } from './Options'
import { BeanDefinition } from './BeanDefinition'

export default interface BeanLoaderRegistry {
  register (loader: Loader): void
  get (loaderOptions: LoaderOptions[], basePackage: string): Promise<BeanDefinition[][]>
}
