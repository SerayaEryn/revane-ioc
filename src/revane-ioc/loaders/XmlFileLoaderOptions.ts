import { LoaderOptions } from '../../revane-ioc-core/LoaderOptions'

export class XmlFileLoaderOptions extends LoaderOptions {
  constructor (public file: string) {
    super()
    this.type = 'xml'
  }
}
