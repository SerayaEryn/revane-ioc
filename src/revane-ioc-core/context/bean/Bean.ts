export default interface Bean {
  scope: string
  id (): string
  init (): Promise<any>
  getInstance (): Promise<any>
  postConstruct (): Promise<any>
  preDestroy (): Promise<any>
  executeOnInstance (callback: (instance: any) => Promise<void>): Promise<void>
  type (): string
}
