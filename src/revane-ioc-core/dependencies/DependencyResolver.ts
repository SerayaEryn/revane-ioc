import { BeanDefinition } from '../BeanDefinition'
import Bean from '../context/bean/Bean'
import { DependencyDefinition } from './DependencyDefinition'

export interface DependencyResolver {
  isRelevant: (dependency: DependencyDefinition) => boolean
  resolve: (
    dependency: DependencyDefinition,
    parentId: string,
    beanDefinitions: BeanDefinition[],
    ensureDependencyIsPresent: (
      dependency: DependencyDefinition,
      parentId: string,
      beanDefinitions: BeanDefinition[]
    ) => Promise<void>
  ) => Promise<Bean>
}
