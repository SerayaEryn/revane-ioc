import { BeanDefinition } from '../BeanDefinition'
import Bean from '../context/bean/Bean'
import { DefaultApplicationContext } from '../DefaultApplicationContext'
import { DependencyResolver } from './DependencyResolver'
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
    const classType = dependency.classType
    if (id == null) {
      throw new Error()
    }
    if (classType != null && this.isClass(classType)) {
      if (!(await this.context.hasByClassType(classType))) {
        await registerDependency(dependency, parentId, beanDefinitions)
      }
      return await this.context.getBeanByClassType(classType)
    } else {
      if (!(await this.context.hasById(id))) {
        await registerDependency(dependency, parentId, beanDefinitions)
      }
      return await this.context.getBeanById(id)
    }
  }

  public isClass (classType: any): boolean {
    try {
      Object.defineProperty(classType, 'prototype', { writable: true })
      return false
    } catch (err) {
      return typeof classType === 'function'
    }
  }
}
