import BeanDefinition from './BeanDefinition'
import Loader from './Loader'
import { LoaderOptions } from './Options'

export default interface BeanLoaderRegistry {
  register (loader: Loader): void
  get (loaderOptions: LoaderOptions[], basePackage: string): Promise<BeanDefinition[][]>
}
