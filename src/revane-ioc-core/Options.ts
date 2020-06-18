export type RegexFilter = {
  type: string
  regex: string
}

export class LoaderOptions {
  componentScan?: boolean
  basePackage?: string
  includeFilters?: RegexFilter[]
  excludeFilters?: RegexFilter[]
  file?: string
}

export default class Options {
  public noRedefinition?: boolean
  public basePackage: string
  public loaderOptions?: LoaderOptions[]
  public defaultScope?: string
}
