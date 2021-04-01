import AbstractBean from '../revane-ioc/bean/AbstractBean'

export default class SimplifiedSingletonBean extends AbstractBean {
  public static scope: string = 'singleton'
  private instance: any

  public id (): string {
    return this.beanDefinition.id
  }

  public async init (): Promise<void> {
    this.instance = this.beanDefinition.instance
  }

  public async getInstance (): Promise<any> {
    return this.instance
  }

  public async postConstruct (): Promise<void> {
    if (this.beanDefinition.postConstructKey != null) {
      await this.instance[this.beanDefinition.postConstructKey]()
    }
  }

  public async preDestroy (): Promise<void> {
    if (this.beanDefinition.preDestroyKey != null) {
      await this.instance[this.beanDefinition.preDestroyKey]()
    }
  }

  public async executeOnInstance (callback: (instance: any) => Promise<void>): Promise<void> {
    await callback(this.instance)
  }
}
