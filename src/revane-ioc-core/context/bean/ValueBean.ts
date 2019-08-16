import Bean from './Bean'

export default class ValueBean implements Bean {
  public type: string = 'value'
  private value: any

  constructor (value: any) {
    this.value = value
  }

  public async init (): Promise<any> {
    return Promise.resolve()
  }

  public async getInstance (): Promise<any> {
    return this.value
  }

  public postConstruct (): Promise<any> {
    return Promise.resolve()
  }

  public preDestroy (): Promise<any> {
    return Promise.resolve()
  }
}
