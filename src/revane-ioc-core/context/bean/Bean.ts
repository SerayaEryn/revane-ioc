export default interface Bean {
  type: string
  init (): Promise<any>
  getInstance (): Promise<any>
  postConstruct (): Promise<any>
  preDestroy (): Promise<any>
}
