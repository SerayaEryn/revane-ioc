import { BeanDefinition } from '../BeanDefinition'
import Bean from '../context/bean/Bean'
import { DefaultApplicationContext } from '../DefaultApplicationContext'
import { DependencyResolver } from './DependecyResolver'
import { DependencyDefinition } from './DependencyDefinition'

export class BeanDependencyResolver implements DependencyResolver {
  constructor (private readonly context: DefaultApplicationContext) {}

  public isRelevant (dependency: DependencyDefinition): boolean {
    return dependency.type === 'bean'
  }

  public async resolve (
    dependency: DependencyDefinition,
    parentId: string,
    beanDefinitions: BeanDefinition[],
    registerDependency: (
      dependency: DependencyDefinition,
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
