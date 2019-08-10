import { LoaderOptions, RegexFilter } from '../revane-ioc-core/Options'
import { BeanProvider } from '../revane-ioc-core/context/Container'

export default class Options {
  public noRedefinition?: boolean
  public basePackage?: string
  public includeFilters?: RegexFilter[]
  public excludeFilters?: RegexFilter[]
  public loaderOptions?: LoaderOptions[]
  public plugins?: {
    loaders?: any[],
    containterInitialize?: (beanProvider: BeanProvider) => void
  }
}
