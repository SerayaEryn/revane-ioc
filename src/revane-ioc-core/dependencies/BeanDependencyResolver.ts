import { BeanDefinition } from '../BeanDefinition'
import Bean from '../context/bean/Bean'
import { DefaultApplicationContext } from '../DefaultApplicationContext'
import { DependencyResolver } from './DependecyResolver'
import { Dependency } from './Dependency'

export class BeanDependencyResolver implements DependencyResolver {
  constructor (private readonly context: DefaultApplicationContext) {}

  public isRelevant (dependency: Dependency): boolean {
    return dependency.type === 'bean'
  }

  public async resolve (
    dependency: Dependency,
    parentId: string,
    beanDefinitions: BeanDefinition[],
    registerDependency: (
      dependency: Dependency,
      parentId: string,
      beanDefinitions: BeanDefinition[]
    ) => Promise<void>
  ): Promise<Bean> {
    const id = dependency.value as string
    if (id == null) {
      throw new Error()
    }
    if (!(await this.context.has(id))) {
      await registerDependency(dependency, parentId, beanDefinitions)
    }
    return await this.context.getBean(id)
  }
}
