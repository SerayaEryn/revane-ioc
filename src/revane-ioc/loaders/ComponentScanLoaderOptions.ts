import { LoaderOptions } from '../../revane-ioc-core/LoaderOptions'
import { RegexFilter } from '../RevaneIOC'

export class ComponentScanLoaderOptions extends LoaderOptions {
  constructor (
    public basePackage: string,
    public includeFilters: RegexFilter[] | null,
    public excludeFilters: RegexFilter[] | null
  ) {
    super()
    this.type = 'scan'
  }
}
