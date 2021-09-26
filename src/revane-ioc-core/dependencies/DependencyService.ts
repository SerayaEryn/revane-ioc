import { BeanDefinition } from '../BeanDefinition'
import { DependencyResolver } from './DependencyResolver'
import { DependencyDefinition } from './DependencyDefinition'
import UnknownDependencyType from './UnknownDependencyType'

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
