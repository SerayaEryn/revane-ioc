import Bean from '../../revane-ioc-core/context/bean/Bean'

export default abstract class AbstractBean implements Bean {
  protected isClass: boolean
  public type: string

  public abstract getInstance (): Promise<any>

  public async createInstance (Clazz, dependencies): Promise<any> {
    const parameters = []
    for (const dependency of dependencies.dependencies) {
      parameters.push(await dependency.getInstance())
    }
    let instance = null
    if (this.isClass) {
      instance = new Clazz(...parameters)
    } else {
      instance = Clazz
    }

    for (const bean of dependencies.inject || []) {
      instance[bean.id] = await bean.bean.getInstance()
    }
    return instance
  }

  public async init (): Promise<void> {
    return Promise.resolve()
  }

  public postConstruct (): Promise<any> {
    return Promise.resolve()
  }

  public preDestroy (): Promise<any> {
    return Promise.resolve()
  }
}
