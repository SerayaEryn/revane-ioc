export interface LoaderOptions {}

export default class Options {
  public noRedefinition?: boolean
  public basePackage: string
  public loaderOptions?: LoaderOptions[]
  public defaultScope?: string
  public plugins?: {
    initialize?: Function
  }
}
