import { LoaderOptions } from './LoaderOptions.js'

export interface RegexFilter {
  type: string
  regex: string
}

export default class Options {
  public noRedefinition?: boolean
  public basePackage: string
  public loaderOptions: LoaderOptions[]
  public defaultScope?: string
}
