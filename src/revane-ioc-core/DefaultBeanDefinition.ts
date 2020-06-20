import Bean from './context/bean/Bean'
import { Property } from './Property'
import { BeanDefinition } from './BeanDefinition'
import * as uid from 'uid-safe'

export default class DefaultBeanDefinition implements BeanDefinition {
  public class: string
  public id: string
  public uid: string = uid.sync(16)
  public type: string
  public dependencyIds: Property[]
  public loadAfter?: Property[]
  public path: string
  public scope: string
  public instance?: any
  public classConstructor?: any
  public dependencies: Bean[] = []
  public conditionalOnMissingBean?: string

  constructor (id: string) {
    this.id = id
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
