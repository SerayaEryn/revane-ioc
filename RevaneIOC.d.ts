export type ComponentScanLoaderOptions = {
  componentScan: boolean
}

export type FileLoaderOptions = {
  file: string
}

export type RegexFilter = {
  type: string, 
  regex: string
}

export class Options {
  public noRedefinition?: boolean
  public basePackage: string
  public configurationFiles?: string[]
  public componentScan?: boolean
  public includeFilters?: RegexFilter[]
  public excludeFilters?: RegexFilter[]
  public loaderOptions?: (ComponentScanLoaderOptions | FileLoaderOptions)[]
}

declare class RevaneIOC {
  constructor (options: Options)
  public initialize (): Promise<void>
  public get (id: string): any
  public has (id: string): boolean
  public getMultiple (ids: string[]): any[]
  public getByType (type: string): any[]
  public tearDown (): Promise<void>
}

declare class ComponentOptions {
  public id: string
  public dependencies: string[]
}

export function Component(options?: string | ComponentOptions): Function
export function Repository(options?: string | ComponentOptions): Function
export function Service(options?: string | ComponentOptions): Function
export function Controller(options?: string | ComponentOptions): Function
export function Scope(scope: string): Function
export function Inject(scope: string | string[]): Function

export default RevaneIOC;
