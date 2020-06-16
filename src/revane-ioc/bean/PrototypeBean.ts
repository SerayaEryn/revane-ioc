import AbstractBean from './AbstractBean'
import BeanDefinition from '../../revane-ioc-core/BeanDefinition'

export default class PrototypeBean extends AbstractBean {
  public static scope: string = 'prototype'
  public entry: BeanDefinition
  private callback: (instance: any) => Promise<void>

  constructor (entry: BeanDefinition) {
    super(entry)
    this.entry = entry
  }

  public async getInstance (): Promise<any> {
    const instance = await this.createInstance()
    if (this.callback) {
      await this.callback(instance)
    }
    if (instance.postConstruct) {
      await instance.postConstruct()
    }
    return instance
  }

  public async init (): Promise<void> {
    return Promise.resolve()
  }

  public async executeOnInstance (callback: (instance: any) => Promise<void>): Promise<void> {
    this.callback = callback
  }

  public id (): string {
    return this.entry.id
  }
}
