import Bean from '../../revane-ioc-core/context/bean/Bean'
import { BeanDefinition } from '../RevaneIOC'

export default abstract class AbstractBean implements Bean {
  protected beanDefinition: BeanDefinition
  public scope: string

  constructor (entry: BeanDefinition) {
    this.beanDefinition = entry
  }

  public type (): string {
    return this.beanDefinition.type
  }

  public abstract id (): string

  public abstract getInstance (): Promise<any>

  public abstract executeOnInstance (callback: (instance: any) => Promise<void>): Promise<void>

  public async createInstance (): Promise<any> {
    const parameters: any[] = []
    for (const dependency of this.beanDefinition.dependencies) {
      parameters.push(await dependency.getInstance())
    }
    let instance = null
    if (this.beanDefinition.isClass()) {
      if (this.beanDefinition.classConstructor == null) {
        throw new Error('cannot create instance')
      }
      // eslint-disable-next-line new-cap
      instance = new this.beanDefinition.classConstructor(...parameters)
    } else {
      instance = this.beanDefinition.classConstructor ?? this.beanDefinition.instance
    }
    return instance
  }

  public abstract init (): Promise<void>

  public async postConstruct (): Promise<any> {
    return await Promise.resolve()
  }

  public abstract preDestroy (): Promise<any>
}
