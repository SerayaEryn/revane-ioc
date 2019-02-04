import AbstractBean from './AbstractBean'
import BeanDefinition from '../../revane-ioc-core/BeanDefinition'
import Bean from '../../revane-ioc-core/context/bean/Bean'

export default class PrototypeBean extends AbstractBean {
  public static scope: string = 'prototype'
  public isClass: boolean
  private type: string
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

  public getInstance (): any {
    const instance = this.createInstance(this.clazz, this.dependencies)
    if (instance.postConstruct) {
      instance.postConstruct()
    }
    return instance
  }
}
