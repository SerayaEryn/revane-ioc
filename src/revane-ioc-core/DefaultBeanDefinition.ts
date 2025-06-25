import Bean from "./context/bean/Bean.js";
import { BeanDefinition } from "./BeanDefinition.js";
import InvalidScopeError from "./context/errors/InvalidScopeError.js";
import BeanTypeRegistry from "./context/bean/BeanTypeRegistry.js";
import { Constructor } from "./Constructor.js";
import { DependencyDefinition } from "./dependencies/DependencyDefinition.js";
import { ALIAS_VALUE, PROTOTYPE_VALUE, SINGLETON_VALUE } from "./Scopes.js";

export default class DefaultBeanDefinition implements BeanDefinition {
  public class: string;
  public id: string;
  public type: string;
  public dependencyIds: DependencyDefinition[];
  public path: string;
  public scope:
    | typeof SINGLETON_VALUE
    | typeof PROTOTYPE_VALUE
    | typeof ALIAS_VALUE;
  public instance?: any;
  public classConstructor?: Constructor;
  public dependencies: Bean[] = [];
  public conditionalOnMissingBean?: string;
  public key: string | null;
  public postConstructKey: string | null;
  public preDestroyKey: string | null;
  public isAlias: boolean = false;

  constructor(id: string) {
    this.id = id;
  }

  public async create(
    dependencies: Bean[],
    beanTypeRegistry: BeanTypeRegistry,
    postProcess: (
      bean: Bean,
      beanDefinition: BeanDefinition,
      instance: any,
    ) => Promise<void>,
  ): Promise<Bean> {
    this.dependencies = dependencies;
    const BeanForScope = beanTypeRegistry.get(this.scope);
    if (BeanForScope != null) {
      const bean = new BeanForScope(this, postProcess);
      return bean;
    }
    throw new InvalidScopeError(this.id, this.scope);
  }

  public isClass(): boolean {
    try {
      Object.defineProperty(this.classConstructor, "prototype", {
        writable: true,
      });
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return typeof this.classConstructor === "function";
    }
  }
}
