import Bean from '../../revane-ioc-core/context/bean/Bean'
import { BeanDefinition } from '../RevaneIOC'

export default abstract class AbstractBean implements Bean {
  protected entry: BeanDefinition
  public scope: string

  constructor (entry: BeanDefinition) {
    this.entry = entry
  }

  public type (): string {
    return this.entry.type
  }

  public abstract id (): string

  public abstract getInstance (): Promise<any>

  public abstract executeOnInstance (callback: (instance: any) => Promise<void>): Promise<void>

  public async createInstance (): Promise<any> {
    const parameters = []
    for (const dependency of this.entry.dependencies) {
      parameters.push(await dependency.getInstance())
    }
    let instance = null
    if (this.entry.isClass()) {
      // eslint-disable-next-line new-cap
      instance = new this.entry.classConstructor(...parameters)
    } else {
      instance = this.entry.classConstructor || this.entry.instance
    }
    return instance
  }

  public abstract init (): Promise<void>

  public async postConstruct (): Promise<any> {
    return await Promise.resolve()
  }

  public async preDestroy (): Promise<any> {
    return await Promise.resolve()
  }
}
