import BeanTypeRegistry from "./BeanTypeRegistry.js";

export default class DefaultBeanTypeRegistry implements BeanTypeRegistry {
  private typesByScope = new Map<string, any>();

  public register(beanType: any): void {
    this.typesByScope[beanType.scope] = beanType;
  }

  public get(scope: string): any {
    return this.typesByScope[scope];
  }
}
