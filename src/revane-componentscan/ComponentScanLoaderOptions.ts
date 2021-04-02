import { LoaderOptions } from '../revane-ioc/RevaneIOC'

export class ComponentScanLoaderOptions extends LoaderOptions {
  constructor (
    public basePackage: string,
    public includeFilters: any[] | null,
    public excludeFilters: any[] | null
  ) {
    super()
    this.type = 'scan'
  }
}
