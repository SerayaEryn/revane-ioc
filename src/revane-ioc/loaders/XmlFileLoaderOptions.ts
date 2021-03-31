import { LoaderOptions } from '../../revane-ioc-core/LoaderOptions'

export class XmlFileLoaderOptions extends LoaderOptions {
  constructor (
    public basePackage: string,
    public file: string
  ) {
    super()
    this.type = 'xml'
  }
}
