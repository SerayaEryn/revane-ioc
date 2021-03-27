import Bean from './context/bean/Bean'
import { Property } from './Property'
import { BeanDefinition } from './BeanDefinition'
import InvalidScopeError from './context/errors/InvalidScopeError'
import BeanTypeRegistry from './context/bean/BeanTypeRegistry'
import { Constructor } from './Constructor'
import { uid } from '../revane-utils/Random'

export default class DefaultBeanDefinition implements BeanDefinition {
  public class: string
  public id: string
  public uid: string = uid()
  public type: string
  public dependencyIds: Property[]
  public loadAfter?: Property[]
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

  public async create (dependencies: Bean[], beanTypeRegistry: BeanTypeRegistry): Promise<Bean> {
    this.dependencies = dependencies
    const BeanForScope = beanTypeRegistry.get(this.scope)
    if (BeanForScope != null) {
      return new BeanForScope(this)
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
