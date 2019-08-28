import BeanDefinition from './BeanDefinition'
import Loader from './Loader'

export default interface BeanLoaderRegistry {
  register (loader: Loader): void
  get (): Promise<BeanDefinition[][]>
}
