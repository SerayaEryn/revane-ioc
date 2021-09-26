import { BeanDefinition } from '../BeanDefinition'
import { DependencyResolver } from './DependencyResolver'
import { DependencyDefinition } from './DependencyDefinition'
import UnknownDependencyType from './UnknownDependencyType'
import Bean from '../context/bean/Bean'

export class DependencyService {
  constructor (private readonly dependencyResolvers: DependencyResolver[]) {}

  async getDependency (
    dependency: DependencyDefinition,
    parentId: string,
    beanDefinitions: BeanDefinition[],
    registerDependency: (
      dependency: DependencyDefinition,
      parentId: string,
      beanDefinitions: BeanDefinition[]
    ) => Promise<void>
  ): Promise<Bean> {
    let error: Error | null = null
    for (const dependencyResolver of this.dependencyResolvers) {
      if (dependencyResolver.isRelevant(dependency)) {
        try {
          return await dependencyResolver.resolve(
            dependency,
            parentId,
            beanDefinitions,
            registerDependency
          )
        } catch (err) {
          error = err
          continue
        }
      }
    }
    if (error != null) {
      throw error
    }
    throw new UnknownDependencyType(dependency.type)
  }
}
