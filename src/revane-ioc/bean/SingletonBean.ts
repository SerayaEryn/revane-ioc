import AbstractBean from './AbstractBean'

export default class SingletonBean extends AbstractBean {
  public static scope: string = 'singleton'
  protected isClass: boolean
  public type: string
  private instance
  private dependencies: any
  private Clazz: any

  constructor (Clazz, entry, isClass, dependencies) {
    super()
    this.type = entry.type
    this.isClass = isClass
    this.type = entry.type
    this.Clazz = Clazz
    this.dependencies = dependencies
  }

  public async init (): Promise<void> {
    this.instance = await this.createInstance(this.Clazz, this.dependencies)
  }

  public async getInstance (): Promise<any> {
    return this.instance
  }

  public async postConstruct () {
    if (this.instance.postConstruct) {
      await this.instance.postConstruct()
    }
  }

  public preDestroy (): Promise<any> {
    if (this.instance.preDestroy) {
      return this.instance.preDestroy()
    }
    return Promise.resolve()
  }
}
