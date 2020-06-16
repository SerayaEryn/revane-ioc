import { BeanFactoryPostProcessor } from './postProcessors/BeanFactoryPostProcessor'
import BeanDefinition from './BeanDefinition'
import { DefaultApplicationContext } from './DefaultApplicationContext'
import Bean from './context/bean/Bean'
import InvalidScopeError from './context/errors/InvalidScopeError'
import ValueBean from './context/bean/ValueBean'
import DependencyRegisterError from './context/errors/DependencyRegisterError'
import BeanTypeRegistry from './context/bean/BeanTypeRegistry'
import DependencyNotFoundError from './context/errors/DependencyNotFoundError'
import Options from './Options'
import BeanDefinedTwiceError from './context/errors/BeanDefinedTwiceError'
import { BeanFactoryPreProcessor } from './preProcessors/BeanFactoryPreProcessor'
import { Property } from './Property'
import { ContextPlugin } from './context/ContextPlugin'

export class BeanFactory {
  private preProcessors: BeanFactoryPreProcessor[]
  private postProcessors: BeanFactoryPostProcessor[]
  private context: DefaultApplicationContext
  private beanTypeRegistry: BeanTypeRegistry
  private options: Options
  private plugins: Map<string, any>

  constructor (
    preProcessors: BeanFactoryPreProcessor[],
    postProcessors: BeanFactoryPostProcessor[],
    context: DefaultApplicationContext,
    beanTypeRegistry: BeanTypeRegistry,
    options: Options,
    plugins: Map<string, any>
  ) {
    this.preProcessors = preProcessors
    this.postProcessors = postProcessors
    this.context = context
    this.beanTypeRegistry = beanTypeRegistry
    this.options = options
    this.plugins = plugins
  }

  async process (beanDefinitions: BeanDefinition[]): Promise<void> {
    for (const contextPlugin of this.plugins.get('contextInitialization') as ContextPlugin[] || []) {
      beanDefinitions = await contextPlugin.plugin(beanDefinitions)
    }
    const processedBeanDefinitions: Map<string, BeanDefinition> = new Map()
    let allPreProcessedBeanDefinitions = []
    for (const beanDefinition of beanDefinitions) {
      const exitingBeanDefininaton = processedBeanDefinitions.get(beanDefinition.id)
      if (exitingBeanDefininaton && this.options.noRedefinition) {
        throw new BeanDefinedTwiceError(exitingBeanDefininaton.id)
      }
      const preProcessedBeanDefinitions = await this.preProcess(beanDefinition)
      allPreProcessedBeanDefinitions = allPreProcessedBeanDefinitions.concat(preProcessedBeanDefinitions)
    }
    for (const preProcessedBeanDefinition of allPreProcessedBeanDefinitions) {
      processedBeanDefinitions.set(preProcessedBeanDefinition.id, preProcessedBeanDefinition)
      const bean = await this.registerBean(preProcessedBeanDefinition, beanDefinitions)
      const postProcessedBeans = await this.postProcess(bean, preProcessedBeanDefinition)
      this.context.put(postProcessedBeans)
    }
  }

  private async postProcess (bean: Bean, beanDefinition: BeanDefinition) {
    let postProcessedBeanDefinitions: Bean[] = []
    for (const postProcessor of this.postProcessors) {
      const postProcessed = await postProcessor.postProcess(beanDefinition, bean)
      postProcessedBeanDefinitions = postProcessedBeanDefinitions.concat(postProcessed)
    }
    return postProcessedBeanDefinitions
  }

  private async preProcess (beanDefinition: BeanDefinition): Promise<BeanDefinition[]> {
    let preProcessedBeanDefinitions: BeanDefinition[] = []
    for (const preProcessor of this.preProcessors) {
      const preProcessed = await preProcessor.preProcess(beanDefinition)
      preProcessedBeanDefinitions = preProcessedBeanDefinitions.concat(preProcessed)
    }
    return preProcessedBeanDefinitions
  }

  private async registerBean (entry: BeanDefinition, beanDefinitions: BeanDefinition[]): Promise<Bean> {
    try {
      const bean = await this.createBean(entry, beanDefinitions)
      await bean.init()
      await bean.postConstruct()
      return bean
    } catch (error) {
      if (error instanceof DependencyNotFoundError) {
        throw error
      }
      throw new DependencyRegisterError(entry.id, error)
    }
  }

  private async createBean (
    entry: BeanDefinition,
    beanDefinitions: BeanDefinition[]
  ): Promise<Bean> {
    const BeanForScope = this.beanTypeRegistry.get(entry.scope)
    if (BeanForScope) {
      return this.createBeanForScope(BeanForScope, entry, beanDefinitions)
    }
    throw new InvalidScopeError(entry.scope)
  }

  private async createBeanForScope (
    BeanForScope: any,
    entry: BeanDefinition,
    beanDefinitions: BeanDefinition[]
  ): Promise<any> {
    entry.dependencies = await this.getDependencies(entry, beanDefinitions)
    return new BeanForScope(entry)
  }

  private async getDependencies (
    entry: BeanDefinition,
    beanDefinitions: BeanDefinition[]
  ): Promise<Bean[]> {
    if (entry.isClass()) {
      const dependencies: Bean[] = []
      for (const property of entry.dependencyIds) {
        const dependency = await this.getDependecySafe(
          property,
          entry.id,
          beanDefinitions
        )
        dependencies.push(dependency)
      }
      return dependencies
    }
    return []
  }

  private async getDependecySafe (
    property: Property,
    parentId: string,
    beanDefinitions: BeanDefinition[]
  ): Promise<Bean> {
    if (property.value) {
      return new ValueBean(property.value)
    }
    await this.ensureDependencyIsPresent(property, parentId, beanDefinitions)
    return this.context.getBean(property.ref)
  }

  private async ensureDependencyIsPresent (
    property: Property,
    parentId: string,
    beanDefinitions: BeanDefinition[]
  ): Promise<void> {
    if (!(await this.hasDependency(property.ref))) {
      await this.registerDependency(property.ref, parentId, beanDefinitions)
    }
  }

  private async hasDependency (id: string): Promise<boolean> {
    return this.context.has(id)
  }

  private async registerDependency (
    id: string,
    parentId: string,
    beanDefinitions: BeanDefinition[]
  ): Promise<void> {
    try {
      await this.findAndRegisterBean(id, parentId, beanDefinitions)
    } catch (err) {
      this.throwDependencyError(err, id)
    }
  }

  private async findAndRegisterBean (
    id: string,
    parentId: string,
    beanDefinitions: BeanDefinition[]
  ): Promise<void> {
    const entry = this.findEntry(id, parentId, beanDefinitions)
    const bean = await this.registerBean(entry, beanDefinitions)
    const postProcessedBeans = await this.postProcess(bean, entry)
    this.context.put(postProcessedBeans)
  }

  private findEntry (
    id: string,
    parentId: string,
    beanDefinitions: BeanDefinition[]
  ): BeanDefinition {
    for (const entry of beanDefinitions) {
      if (entry.id === id) {
        return entry
      }
    }
    throw new DependencyNotFoundError(id, parentId)
  }

  private throwDependencyError (err: Error, id: string): void {
    if (err instanceof DependencyNotFoundError) {
      throw err
    }
    throw new DependencyRegisterError(id, err)
  }
}
