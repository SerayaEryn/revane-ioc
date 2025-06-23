import AbstractBean from "./AbstractBean.js";
import { Constructor } from "../../revane-ioc-core/Constructor.js";
import Bean from "../../revane-ioc-core/context/bean/Bean.js";
import { ALIAS_VALUE } from "../../revane-ioc-core/Scopes.js";

export default class AliasBean extends AbstractBean {
  public static scope: string = ALIAS_VALUE;
  #target: Bean;

  public classType(): Constructor | undefined {
    return this.#target.classType();
  }

  public id(): string {
    return this.beanDefinition.id;
  }

  public async init(): Promise<any> {
    this.#target = this.beanDefinition.dependencies[0];
  }

  public async getInstance(): Promise<any> {
    return await this.#target.getInstance();
  }

  public async postConstruct(): Promise<any> {
    // empty
  }

  public async preDestroy(): Promise<any> {
    // empty
  }

  public type(): string {
    return "value";
  }
}
