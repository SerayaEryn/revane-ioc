import DefaultBeanDefinition from './DefaultBeanDefinition'
import { LoaderOptions } from '../revane-ioc/RevaneIOC'

export default interface Loader {
  load (options: LoaderOptions, basePackage: string): Promise<DefaultBeanDefinition[]>
  type (): string
  isRelevant (options: LoaderOptions): boolean
}
