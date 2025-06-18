import { BeanDefinition } from "../BeanDefinition.js";
import Bean from "../context/bean/Bean.js";
import { DependencyDefinition } from "./DependencyDefinition.js";

export interface DependencyResolver {
  isRelevant: (dependency: DependencyDefinition) => boolean;
  resolve: (
    dependency: DependencyDefinition,
    parentId: string,
    beanDefinitions: BeanDefinition[],
    ensureDependencyIsPresent: (
      dependency: DependencyDefinition,
      parentId: string,
      beanDefinitions: BeanDefinition[],
    ) => Promise<void>,
  ) => Promise<Bean>;
}
