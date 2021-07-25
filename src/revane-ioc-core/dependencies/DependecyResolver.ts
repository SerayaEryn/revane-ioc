import { BeanDefinition } from '../BeanDefinition'
import Bean from '../context/bean/Bean'
import { Dependency } from './Dependency'

export interface DependencyResolver {
  isRelevant: (dependency: Dependency) => boolean
  resolve: (
    dependency: Dependency,
    parentId: string,
    beanDefinitions: BeanDefinition[],
    ensureDependencyIsPresent: (
      dependency: Dependency,
      parentId: string,
      beanDefinitions: BeanDefinition[]
    ) => Promise<void>
  ) => Promise<Bean>
}
