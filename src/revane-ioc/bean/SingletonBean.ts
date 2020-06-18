import AbstractBean from './AbstractBean'
import DefaultBeanDefinition from '../../revane-ioc-core/DefaultBeanDefinition'

export default class SingletonBean extends AbstractBean {
  public static scope: string = 'singleton'
  private instance: any
  private readonly beanDefinition: DefaultBeanDefinition

  constructor (beanDefinition: DefaultBeanDefinition) {
    super(beanDefinition)
    this.beanDefinition = beanDefinition
  }

  public id (): string {
    return this.beanDefinition.id
  }

  public async init (): Promise<void> {
    this.instance = await this.createInstance()
  }

  public async getInstance (): Promise<any> {
    return this.instance
  }

  public async postConstruct (): Promise<void> {
    if (this.instance.postConstruct != null) {
      await this.instance.postConstruct()
    }
  }

  public async preDestroy (): Promise<void> {
    if (this.instance.preDestroy != null) {
      await this.instance.preDestroy()
    }
  }

  public async executeOnInstance (callback: (instance: any) => Promise<void>): Promise<void> {
    await callback(this.instance)
  }
}
