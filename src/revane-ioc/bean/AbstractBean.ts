import Bean from '../../revane-ioc-core/context/bean/Bean'

export default abstract class AbstractBean implements Bean {
  protected isClass: boolean
  public type: string

  public abstract getInstance (): any

  public createInstance (Clazz, dependencies) {

    const parameters = dependencies.dependencies.map((bean) => bean.getInstance())
    let instance = null
    if (this.isClass) {
      instance = new Clazz(...parameters)
    } else {
      instance = Clazz
    }

    if (dependencies.inject) {
      for (const bean of dependencies.inject) {
        instance[bean.id] = bean.bean.getInstance()
      }
    }
    return instance
  }

  public postConstruct (): Promise<any> {
    return Promise.resolve()
  }

  public preDestroy (): Promise<any> {
    return Promise.resolve()
  }
}
