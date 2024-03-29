import { join } from 'path'
import { LoaderOptions } from '../revane-ioc-core/LoaderOptions'
import { Extension } from './Extension'

export default class Options {
  public profile?: string
  public noRedefinition: boolean = true
  public loaderOptions?: LoaderOptions[]

  public configuration?: {
    directory?: string
    required?: boolean
    disabled?: boolean
  }

  public autoConfiguration?: boolean

  constructor (
    public basePackage: string,
    public extensions: Extension[]
  ) {}

  public configurationPath (): string {
    if (this.configuration?.directory?.startsWith('/') === true) {
      return this.configuration.directory
    }
    return join(this.basePackage, this.configuration?.directory ?? '/config')
  }
}
