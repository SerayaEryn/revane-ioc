import Bean from "./context/bean/Bean.js";
import BeanTypeRegistry from "./context/bean/BeanTypeRegistry.js";
import { Constructor } from "./Constructor.js";
import { DependencyDefinition } from "./dependencies/DependencyDefinition.js";
import { ALIAS_VALUE, PROTOTYPE_VALUE, SINGLETON_VALUE } from "./Scopes.js";

export interface BeanDefinition {
  class: string;
  id: string;
  uid: string;
  type: string;
  dependencyIds: DependencyDefinition[];
  path: string;
  scope: typeof SINGLETON_VALUE | typeof PROTOTYPE_VALUE | typeof ALIAS_VALUE;
  instance?: any;
  classConstructor?: Constructor;
  dependencies: Bean[];
  conditionalOnMissingBean?: string;
  key: string | null;
  postConstructKey: string | null;
  preDestroyKey: string | null;
  isAlias: boolean;

  isClass: () => boolean;
  create: (
    dependencies: Bean[],
    beanTypeRegistry: BeanTypeRegistry,
    postProcess: (
      bean: Bean,
      beanDefinition: BeanDefinition,
      instance: any,
    ) => Promise<void>,
  ) => Promise<Bean>;
}
