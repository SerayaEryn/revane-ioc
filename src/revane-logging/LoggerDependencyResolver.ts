import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'
import Bean from '../revane-ioc-core/context/bean/Bean'
import { DependencyDefinition } from '../revane-ioc-core/dependencies/DependencyDefinition'
import { DependencyResolver } from '../revane-ioc-core/dependencies/DependencyResolver'
import SingletonBean from '../revane-ioc/bean/SingletonBean'
import { DefaultBeanDefinition, Logger } from '../revane-ioc/RevaneIOC'
import { LogFactory } from './LogFactory'

export class LoggerDependencyResolver implements DependencyResolver {
  constructor (private readonly logFactory: LogFactory) {}

  isRelevant (dependency: DependencyDefinition): boolean {
    return dependency.value === 'logger' || dependency.classType === Logger
  }

  async resolve (
    dependency: DependencyDefinition,
    parentId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beanDefinitions: BeanDefinition[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ensureDependencyIsPresent: (
      dependency: DependencyDefinition,
      parentId: string,
      beanDefinitions: BeanDefinition[]
    ) => Promise<void>
  ): Promise<Bean> {
    const beanDefinition = new DefaultBeanDefinition(dependency.value)
    beanDefinition.instance = this.logFactory.getInstance(parentId)
    const bean = new SingletonBean(
      beanDefinition,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      async () => { }
    )
    await bean.init()
    return bean
  }
}
