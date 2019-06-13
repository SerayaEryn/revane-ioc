import { LoaderOptions } from '../revane-ioc-core/Options'

export class ComponentScanLoaderOptions implements LoaderOptions {
  componentScan: boolean
  basePackage: string
  includeFilters?: RegexFilter[]
  excludeFilters?: RegexFilter[]
}

export class FileLoaderOptions implements LoaderOptions {
  file: string
}

export type RegexFilter = {
  type: string,
  regex: string
}

export default class Options {
  public noRedefinition?: boolean
  public basePackage?: string
  public includeFilters?: RegexFilter[]
  public excludeFilters?: RegexFilter[]
  public loaderOptions?: (ComponentScanLoaderOptions | FileLoaderOptions)[]
  public plugins?: {
    loaders?: any[]
  }
}
