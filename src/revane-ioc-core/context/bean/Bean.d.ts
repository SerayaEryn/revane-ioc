export default interface Bean {
  type: string
  getInstance (): any
  postConstruct (): Promise<any>
  preDestroy (): Promise<any>
}
