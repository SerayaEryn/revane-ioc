import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition'
import Bean from '../revane-ioc-core/context/bean/Bean'
import SimplifiedSingletonBean from './SimplifiedSingletonBean'

export class BeanAnnotationBeanDefinition extends DefaultBeanDefinition {
  private readonly propertyKey: string

  constructor (id: string, propertyKey: string) {
    super(id)
    this.propertyKey = propertyKey
  }

  async create (dependencies: Bean[]): Promise<Bean> {
    this.dependencies = []
    const parent = dependencies[0]
    this.instance = (await parent.getInstance())[this.propertyKey]()
    return new SimplifiedSingletonBean(this)
  }

  public isClass (): boolean {
    return true
  }
}
