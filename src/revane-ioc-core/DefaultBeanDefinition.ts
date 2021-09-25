import Bean from './context/bean/Bean'
import { BeanDefinition } from './BeanDefinition'
import InvalidScopeError from './context/errors/InvalidScopeError'
import BeanTypeRegistry from './context/bean/BeanTypeRegistry'
import { Constructor } from './Constructor'
import { uid } from '../revane-utils/Random'
import { DependencyDefinition } from './dependencies/DependencyDefinition'

export default class DefaultBeanDefinition implements BeanDefinition {
  public class: string
  public id: string
  public uid: string = uid()
  public type: string
  public dependencyIds: DependencyDefinition[]
  public path: string
  public scope: string
  public instance?: any
  public classConstructor?: Constructor
  public dependencies: Bean[] = []
  public conditionalOnMissingBean?: string
  public key: string | null
  public postConstructKey: string | null
  public preDestroyKey: string | null

  constructor (id: string) {
    this.id = id
  }

  public async create (
    dependencies: Bean[],
    beanTypeRegistry: BeanTypeRegistry,
    postProcess: (bean: Bean, beanDefinition: BeanDefinition, instance: any) => Promise<void>
  ): Promise<Bean> {
    this.dependencies = dependencies
    const BeanForScope = beanTypeRegistry.get(this.scope)
    if (BeanForScope != null) {
      const bean = new BeanForScope(this, postProcess)
      return bean
    }
    throw new InvalidScopeError(this.scope)
  }

  public isClass (): boolean {
    try {
      Object.defineProperty(this.classConstructor, 'prototype', {
        writable: true
      })
      return false
    } catch (err) {
      return typeof this.classConstructor === 'function'
    }
  }
}
