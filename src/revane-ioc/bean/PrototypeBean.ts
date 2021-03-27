import AbstractBean from './AbstractBean'
import DefaultBeanDefinition from '../../revane-ioc-core/DefaultBeanDefinition'

export default class PrototypeBean extends AbstractBean {
  public static scope: string = 'prototype'
  public entry: DefaultBeanDefinition
  private callback: (instance: any) => Promise<void>

  constructor (entry: DefaultBeanDefinition) {
    super(entry)
    this.entry = entry
  }

  public async getInstance (): Promise<any> {
    const instance = await this.createInstance()
    if (this.callback != null) {
      await this.callback(instance)
    }
    if (this.entry.postConstructKey != null) {
      await instance[this.entry.postConstructKey]()
    }
    return instance
  }

  public async init (): Promise<void> {
    return await Promise.resolve()
  }

  public async executeOnInstance (callback: (instance: any) => Promise<void>): Promise<void> {
    this.callback = callback
  }

  public id (): string {
    return this.entry.id
  }
}
