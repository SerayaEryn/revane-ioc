import Bean from '../../revane-ioc-core/context/bean/Bean'

export default abstract class AbstractBean implements Bean {
  protected isClass: boolean

  public abstract getInstance (): any

  public createInstance (Clazz, dependencies) {
    if (this.isClass) {
      return new Clazz(...dependencies)
    } else {
      return Clazz
    }
  }

  public postConstruct () {
    return Promise.resolve()
  }
}
