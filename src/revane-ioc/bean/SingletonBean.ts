import AbstractBean from './AbstractBean'

export default class SingletonBean extends AbstractBean {
  public static scope: string = 'singleton'
  protected isClass: boolean
  public type: string
  private instance

  constructor (Clazz, entry, isClass, dependencies) {
    super()
    this.type = entry.type
    this.isClass = isClass
    this.type = entry.type
    this.instance = this.createInstance(Clazz, dependencies)
  }

  public getInstance (): any {
    return this.instance
  }

  public async postConstruct () {
    if (this.instance.postConstruct) {
      await this.instance.postConstruct()
    } else {
      return Promise.resolve()
    }
  }

  public preDestroy (): Promise<any> {
    if (this.instance.preDestroy) {
      return this.instance.preDestroy()
    }
    return Promise.resolve()
  }
}
