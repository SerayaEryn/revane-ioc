import Bean from './Bean'

export default class ValueBean implements Bean {
  public scope: string = 'value'
  private value: any

  constructor (value: any) {
    this.value = value
  }

  public id (): string {
    return null
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

  public async executeOnInstance (callback: (instance: any) => Promise<void>): Promise<void> {
    await callback(null)
  }

  public type (): string {
    return null
  }
}
