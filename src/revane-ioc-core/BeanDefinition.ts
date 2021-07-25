import Bean from './context/bean/Bean'
import BeanTypeRegistry from './context/bean/BeanTypeRegistry'
import { Constructor } from './Constructor'
import { Dependency } from './dependencies/Dependency'

export interface BeanDefinition {
  class: string
  id: string
  uid: string
  type: string
  dependencyIds: Dependency[]
  path: string
  scope: string
  instance?: any
  classConstructor?: Constructor
  dependencies: Bean[]
  conditionalOnMissingBean?: string
  key: string | null
  postConstructKey: string | null
  preDestroyKey: string | null

  isClass: () => boolean
  create: (
    dependencies: Bean[],
    beanTypeRegistry: BeanTypeRegistry,
    postProcess: (bean: Bean, beanDefinition: BeanDefinition, instance: any) => Promise<void>
  ) => Promise<Bean>
}
