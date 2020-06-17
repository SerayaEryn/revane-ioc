import Bean from './context/bean/Bean'
import { Property } from './Property'

export interface BeanDefinition {
  class: string
  id: string
  type: string
  dependencyIds: Property[]
  loadAfter?: Property[]
  path: string
  scope: string
  instance?: any
  classConstructor?: any
  dependencies: Bean[]
  isClass (): boolean
}
