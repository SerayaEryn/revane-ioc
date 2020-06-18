import { LoaderOptions } from '../revane-ioc-core/Options'
import { Loader } from './RevaneIOC'
import { ContextPlugin } from '../revane-ioc-core/context/ContextPlugin'

export default class Options {
  public noRedefinition?: boolean
  public basePackage?: string
  public loaderOptions?: LoaderOptions[]
  public plugins?: {
    loaders?: Loader[],
    contextInitialization?: ContextPlugin[]
  }
  public profile: string
  public configuration: {
    directory?: string,
    required?: boolean,
    disabled?: boolean
  }
  public scheduling?: {
    enabled: boolean
  }
}
