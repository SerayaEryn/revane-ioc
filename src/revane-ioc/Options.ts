import { LoaderOptions } from '../revane-ioc-core/Options'
import { Loader } from './RevaneIOC'

export default class Options {
  public noRedefinition?: boolean
  public basePackage?: string
  public loaderOptions?: LoaderOptions[]
  public plugins?: {
    loaders?: Loader[]
  }

  public profile: string

  public configuration: {
    directory?: string
    required?: boolean
    disabled?: boolean
  }

  public scheduling?: {
    enabled: boolean
  }
}
