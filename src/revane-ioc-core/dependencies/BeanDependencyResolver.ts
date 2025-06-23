import { BeanDefinition } from "../BeanDefinition.js";
import Bean from "../context/bean/Bean.js";
import { DefaultApplicationContext } from "../DefaultApplicationContext.js";
import { DependencyResolver } from "./DependencyResolver.js";
import { DependencyDefinition } from "./DependencyDefinition.js";

export class BeanDependencyResolver implements DependencyResolver {
  constructor(private readonly context: DefaultApplicationContext) {}

  public isRelevant(dependency: DependencyDefinition): boolean {
    return dependency.type === "bean";
  }

  public async resolve(
    dependency: DependencyDefinition,
    parentId: string,
    beanDefinitions: BeanDefinition[],
    registerDependency: (
      dependency: DependencyDefinition,
      parentId: string,
      beanDefinitions: BeanDefinition[],
    ) => Promise<void>,
  ): Promise<Bean> {
    const id = dependency.value as string;
    const classType = dependency.classType;
    if (id == null) {
      throw new Error();
    }
    if (classType != null && this.isClass(classType) && classType !== Object) {
      if (!(await this.context.hasByClassType(classType))) {
        await registerDependency(dependency, parentId, beanDefinitions);
      }
      return await this.context.getBeanByClassType(classType);
    } else {
      if (!(await this.context.hasById(id))) {
        await registerDependency(dependency, parentId, beanDefinitions);
      }
      return await this.context.getBeanById(id);
    }
  }

  public isClass(classType: any): boolean {
    try {
      Object.defineProperty(classType, "prototype", { writable: true });
      return false;
    } catch (_) {
      return typeof classType === "function";
    }
  }
}
