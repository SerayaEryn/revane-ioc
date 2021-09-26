import { Constructor } from '../../revane-ioc-core/Constructor'
import Bean from '../../revane-ioc-core/context/bean/Bean'
import { BeanDefinition } from '../RevaneIOC'

export default abstract class AbstractBean implements Bean {
  public scope: string

  constructor (
    protected beanDefinition: BeanDefinition,
    protected readonly postProcess: (bean: Bean, beanDefinition: BeanDefinition, instance: any) => Promise<void>
  ) {}

  public type (): string {
    return this.beanDefinition.type
  }

  public classType (): Constructor | undefined {
    return this.beanDefinition.classConstructor
  }

  public abstract id (): string

  public abstract getInstance (): Promise<any>

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
    await this.postProcess(this, this.beanDefinition, instance)
    return instance
  }

  public abstract init (): Promise<void>

  public async postConstruct (): Promise<any> {
    return await Promise.resolve()
  }

  public abstract preDestroy (): Promise<any>
}
