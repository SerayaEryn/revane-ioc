import AbstractBean from './AbstractBean'
import { Scopes } from '../../revane-ioc-core/Scopes'

export default class PrototypeBean extends AbstractBean {
  public static scope: string = Scopes.PROTOTYPE
  private readonly instances: any[] = []
  private callback: (instance: any) => Promise<void>

  public async getInstance (): Promise<any> {
    const instance = await this.createInstance()
    if (this.callback != null) {
      await this.callback(instance)
    }
    if (this.beanDefinition.postConstructKey != null) {
      await instance[this.beanDefinition.postConstructKey]()
    }
    this.instances.push(instance)
    return instance
  }

  public async preDestroy (): Promise<void> {
    for (const instance of this.instances) {
      if (this.beanDefinition.preDestroyKey != null) {
        await instance[this.beanDefinition.preDestroyKey]()
      }
    }
  }

  public async init (): Promise<void> {
    return await Promise.resolve()
  }

  public async executeOnInstance (callback: (instance: any) => Promise<void>): Promise<void> {
    this.callback = callback
  }

  public id (): string {
    return this.beanDefinition.id
  }
}
