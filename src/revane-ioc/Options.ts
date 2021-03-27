import { LoaderOptions } from '../revane-ioc-core/Options'
import { Extension } from './Extension'

export default class Options {
  public profile?: string
  public noRedefinition?: boolean
  public loaderOptions?: LoaderOptions[]
  public extensions: Extension[]

  public configuration?: {
    directory?: string
    required?: boolean
    disabled?: boolean
  }

  public autoConfiguration?: boolean

  constructor (public basePackage: string) {}
}
