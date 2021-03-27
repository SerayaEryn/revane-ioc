import { LoaderOptions, BeanDefinition } from '../revane-ioc/RevaneIOC'

export default interface Loader {
  load: (options: LoaderOptions, basePackage: string) => Promise<BeanDefinition[]>
  type: () => string
  isRelevant: (options: LoaderOptions) => boolean
}
