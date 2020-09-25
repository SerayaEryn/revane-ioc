import Bean from './context/bean/Bean'
import { Property } from './Property'
import BeanTypeRegistry from './context/bean/BeanTypeRegistry'

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
  classConstructor?: any
  dependencies: Bean[]
  conditionalOnMissingBean?: string
  isClass (): boolean
  create (dependencies: Bean[], beanTypeRegistry: BeanTypeRegistry): Promise<Bean>
}
