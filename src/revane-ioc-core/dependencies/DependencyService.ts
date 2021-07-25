import { BeanDefinition } from '../BeanDefinition'
import { DependencyResolver } from './DependecyResolver'
import { Dependency } from './Dependency'
import UnknownDependencyType from './UnknownDependencyType'

export class DependencyService {
  constructor (private readonly dependencyResolvers: DependencyResolver[]) {}

  async getDependency (
    dependency: Dependency,
    parentId: string,
    beanDefinitions: BeanDefinition[],
    registerDependency: (
      dependency: Dependency,
      parentId: string,
      beanDefinitions: BeanDefinition[]
    ) => Promise<void>
  ): Promise<any> {
    for (const dependencyResolver of this.dependencyResolvers) {
      if (dependencyResolver.isRelevant(dependency)) {
        return await dependencyResolver.resolve(
          dependency,
          parentId,
          beanDefinitions,
          registerDependency
        )
      }
    }
    throw new UnknownDependencyType(dependency.type)
  }
}
