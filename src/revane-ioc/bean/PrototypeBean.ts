import AbstractBean from './AbstractBean.js'
import { Scopes } from '../../revane-ioc-core/Scopes.js'

export default class PrototypeBean extends AbstractBean {
  public static scope: string = Scopes.PROTOTYPE
  private readonly instances: any[] = []

  public async getInstance (): Promise<any> {
    const instance = await this.createInstance()
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

  public id (): string {
    return this.beanDefinition.id
  }
}
