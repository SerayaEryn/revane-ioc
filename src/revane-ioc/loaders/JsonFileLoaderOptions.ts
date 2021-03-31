import { LoaderOptions } from '../../revane-ioc-core/LoaderOptions'

export class JsonFileLoaderOptions extends LoaderOptions {
  constructor (public file: string) {
    super()
    this.type = 'json'
  }
}
