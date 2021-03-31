import { LoaderOptions, BeanDefinition } from '../revane-ioc/RevaneIOC'

export default interface Loader {
  load: (options: LoaderOptions[]) => Promise<BeanDefinition[]>
  type: () => string
}
