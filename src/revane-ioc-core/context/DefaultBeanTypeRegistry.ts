import BeanTypeRegistry from './BeanTypeRegistry'

export default class DefaultBeanTypeRegistry implements BeanTypeRegistry {
  private typesByScope: Map<string, any> = new Map()

  public register (beanType: any): void {
    this.typesByScope[beanType.scope] = beanType
  }

  public get (scope: any): any {
    return this.typesByScope[scope]
  }
}
