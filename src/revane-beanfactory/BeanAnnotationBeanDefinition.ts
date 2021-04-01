import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition'
import Bean from '../revane-ioc-core/context/bean/Bean'
import SimplifiedSingletonBean from './SimplifiedSingletonBean'
import BeanTypeRegistry from '../revane-ioc-core/context/bean/BeanTypeRegistry'
import { BeanDefinition } from '../revane-ioc/RevaneIOC'

export class BeanAnnotationBeanDefinition extends DefaultBeanDefinition {
  private readonly propertyKey: string

  constructor (id: string, propertyKey: string) {
    super(id)
    this.propertyKey = propertyKey
  }

  async create (
    dependencies: Bean[],
    beanTypeRegistry: BeanTypeRegistry,
    postProcess: (bean: Bean, beanDefinition: BeanDefinition, instance: any) => Promise<void>
  ): Promise<Bean> {
    this.dependencies = []
    const parent = dependencies[0]
    this.instance = (await parent.getInstance())[this.propertyKey]()
    return new SimplifiedSingletonBean(this, postProcess)
  }

  public isClass (): boolean {
    return true
  }
}
