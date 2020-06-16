import AbstractBean from './AbstractBean'
import BeanDefinition from '../../revane-ioc-core/BeanDefinition'

export default class SingletonBean extends AbstractBean {
  public static scope: string = 'singleton'
  private instance: any
  private beanDefinition: BeanDefinition

  constructor (beanDefinition: BeanDefinition) {
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

  public async executeOnInstance (callback: (instance: any) => Promise<void>): Promise<void> {
    await callback(this.instance)
  }
}
