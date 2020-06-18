import Bean from '../../revane-ioc-core/context/bean/Bean'
import { BeanDefinition } from '../RevaneIOC'

export default abstract class AbstractBean implements Bean {
  protected entry
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
      instance = new this.entry.classConstructor(...parameters)
    } else {
      instance = this.entry.classConstructor || this.entry.instance
    }
    return instance
  }

  public abstract async init (): Promise<void>

  public postConstruct (): Promise<any> {
    return Promise.resolve()
  }

  public preDestroy (): Promise<any> {
    return Promise.resolve()
  }
}
