import { BeanDefinition } from "../revane-ioc-core/BeanDefinition.js";
import Bean from "../revane-ioc-core/context/bean/Bean.js";
import { DependencyDefinition } from "../revane-ioc-core/dependencies/DependencyDefinition.js";
import { DependencyResolver } from "../revane-ioc-core/dependencies/DependencyResolver.js";
import InstanceSingletonBean from "../revane-ioc/bean/InstanceSingletonBean.js";
import { DefaultBeanDefinition, Logger } from "../revane-ioc/RevaneIOC.js";
import { LogFactory } from "./LogFactory.js";

export class LoggerDependencyResolver implements DependencyResolver {
  constructor(private readonly logFactory: LogFactory) {}

  isRelevant(dependency: DependencyDefinition): boolean {
    return dependency.value === "logger" || dependency.classType === Logger;
  }

  async resolve(
    dependency: DependencyDefinition,
    parentId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beanDefinitions: BeanDefinition[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ensureDependencyIsPresent: (
      dependency: DependencyDefinition,
      parentId: string,
      beanDefinitions: BeanDefinition[],
    ) => Promise<void>,
  ): Promise<Bean> {
    const beanDefinition = new DefaultBeanDefinition(dependency.value);
    beanDefinition.instance = this.logFactory.getInstance(parentId);
    return new InstanceSingletonBean(beanDefinition);
  }
}
