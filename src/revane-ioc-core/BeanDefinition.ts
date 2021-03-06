import Bean from './context/bean/Bean'
import { Property } from './Property'
import BeanTypeRegistry from './context/bean/BeanTypeRegistry'
import { Constructor } from './Constructor'

export interface BeanDefinition {
  class: string
  id: string
  uid: string
  type: string
  dependencyIds: Property[]
  loadAfter?: Property[]
  path: string
  scope: string
  instance?: any
  classConstructor?: Constructor
  dependencies: Bean[]
  conditionalOnMissingBean?: string
  isClass (): boolean
  create (dependencies: Bean[], beanTypeRegistry: BeanTypeRegistry): Promise<Bean>
}
