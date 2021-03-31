import { LoaderOptions } from './LoaderOptions'

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
