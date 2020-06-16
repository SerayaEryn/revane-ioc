import Bean from './context/bean/Bean'
import { Property } from './Property'

export default class BeanDefinition {
  public class: string
  public id: string
  public type: string
  public dependencyIds: Property[]
  public loadAfter?: Property[]
  public path: string
  public scope: string
  public instance?: any
  public configurationProperties?: any
  public classConstructor?: any
  public dependencies: Bean[] = []

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
