import { Scopes } from '../revane-ioc-core/Scopes.js'
import AbstractBean from '../revane-ioc/bean/AbstractBean.js'

export default class SimplifiedSingletonBean extends AbstractBean {
  public static scope: string = Scopes.SINGLETON
  private instance: any

  public id (): string {
    return this.beanDefinition.id
  }

  public async init (): Promise<void> {
    this.instance = this.beanDefinition.instance
  }

  public async getInstance (): Promise<any> {
    await this.postProcess(this, this.beanDefinition, this.instance)
    await this.postConstruct()
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
