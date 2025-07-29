import { BeanDefinition } from "../BeanDefinition.js";
import { DependencyResolver } from "./DependencyResolver.js";
import { DependencyDefinition } from "./DependencyDefinition.js";
import UnknownDependencyType from "./UnknownDependencyType.js";
import Bean from "../context/bean/Bean.js";

export class DependencyService {
  constructor(private readonly dependencyResolvers: DependencyResolver[]) {}

  async getDependency(
    dependency: DependencyDefinition,
    parentId: string,
    beanDefinitions: BeanDefinition[],
    registerDependency: (
      dependency: DependencyDefinition,
      parentId: string,
      beanDefinitions: BeanDefinition[],
    ) => Promise<Bean>,
  ): Promise<Bean> {
    let error: Error | null = null;
    for (const dependencyResolver of this.dependencyResolvers) {
      if (dependencyResolver.isRelevant(dependency)) {
        try {
          return await dependencyResolver.resolve(
            dependency,
            parentId,
            beanDefinitions,
            registerDependency,
          );
        } catch (err) {
          error = err;
          continue;
        }
      }
    }
    if (error != null) {
      throw error;
    }
    throw new UnknownDependencyType(dependency.type);
  }
}
