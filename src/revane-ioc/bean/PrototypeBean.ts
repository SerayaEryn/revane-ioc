import AbstractBean from './AbstractBean'
import BeanDefinition from '../../revane-ioc-core/BeanDefinition'

export default class PrototypeBean extends AbstractBean {
  public static scope: string = 'prototype'
  public isClass: boolean
  public type: string
  private clazz: string
  public entry: BeanDefinition
  private dependencies: any

  constructor (clazz, entry, isClass, dependencies) {
    super()
    this.type = entry.type
    this.clazz = clazz
    this.isClass = isClass
    this.entry = entry
    this.dependencies = dependencies
  }

  public async getInstance (): Promise<any> {
    const instance = await this.createInstance(this.clazz, this.dependencies)
    for (const key of Object.keys(this.dependencies.configurationPropertyValues || {})) {
      instance[key] = this.dependencies.configurationPropertyValues[key]
    }
    if (instance.postConstruct) {
      await instance.postConstruct()
    }
    return instance
  }

  public async init (): Promise<void> {
    return Promise.resolve()
  }
}
