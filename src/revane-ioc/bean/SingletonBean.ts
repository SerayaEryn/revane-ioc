import AbstractBean from './AbstractBean'
import { Scopes } from '../../revane-ioc-core/Scopes'

export default class SingletonBean extends AbstractBean {
  public static scope: string = Scopes.SINGLETON
  private instance: any

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
    if (this.beanDefinition.postConstructKey != null) {
      await this.instance[this.beanDefinition.postConstructKey]()
    }
  }

  public async preDestroy (): Promise<void> {
    if (this.beanDefinition.preDestroyKey != null) {
      await this.instance[this.beanDefinition.preDestroyKey]()
    }
  }
}
