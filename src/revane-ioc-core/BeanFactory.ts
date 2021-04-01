import { BeanFactoryPostProcessor } from './postProcessors/BeanFactoryPostProcessor'
import { DefaultApplicationContext } from './DefaultApplicationContext'
import Bean from './context/bean/Bean'
import ValueBean from './context/bean/ValueBean'
import DependencyRegisterError from './context/errors/DependencyRegisterError'
import BeanTypeRegistry from './context/bean/BeanTypeRegistry'
import DependencyNotFoundError from './context/errors/DependencyNotFoundError'
import Options from './Options'
import BeanDefinedTwiceError from './context/errors/BeanDefinedTwiceError'
import { BeanFactoryPreProcessor } from './preProcessors/BeanFactoryPreProcessor'
import { Property } from './Property'
import { BeanDefinition } from './BeanDefinition'
import { RethrowableError } from './RethrowableError'

export class BeanFactory {
  private readonly preProcessors: BeanFactoryPreProcessor[]
  private readonly postProcessors: BeanFactoryPostProcessor[]
  private readonly context: DefaultApplicationContext
  private readonly beanTypeRegistry: BeanTypeRegistry
  private readonly options: Options

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
  }

  async process (beanDefinitions: BeanDefinition[]): Promise<void> {
    let preprocessed = [...beanDefinitions]
    for (const preProcessor of this.preProcessors) {
      for (const beanDefinition of beanDefinitions) {
        const preProcessedBeanDefinitions = await preProcessor.preProcess(beanDefinition, preprocessed)
        const index = preprocessed.indexOf(beanDefinition)
        preprocessed.splice(index, 1)
        preprocessed = preprocessed.concat(preProcessedBeanDefinitions)
      }
    }
    const processedBeanDefinitions: Map<string, BeanDefinition> = new Map()
    for (const preProcessedBeanDefinition of preprocessed) {
      const exitingBeanDefininaton = processedBeanDefinitions.get(preProcessedBeanDefinition.id)
      if (exitingBeanDefininaton != null && this.options.noRedefinition !== false) {
        throw new BeanDefinedTwiceError(exitingBeanDefininaton.id)
      }
      processedBeanDefinitions.set(preProcessedBeanDefinition.id, preProcessedBeanDefinition)
      const bean = await this.registerBean(preProcessedBeanDefinition, preprocessed)
      this.context.put([bean])
    }
  }

  private async registerBean (entry: BeanDefinition, beanDefinitions: BeanDefinition[]): Promise<Bean> {
    try {
      const bean = await this.createBean(entry, beanDefinitions)
      await bean.init()
      await bean.postConstruct()
      return bean
    } catch (error) {
      if (error instanceof RethrowableError && error.isRethrowable) {
        throw error
      }
      throw new DependencyRegisterError(entry.id, error)
    }
  }

  private async createBean (
    entry: BeanDefinition,
    beanDefinitions: BeanDefinition[]
  ): Promise<Bean> {
    const dependencies = await this.getDependencies(entry, beanDefinitions)
    return await entry.create(
      dependencies,
      this.beanTypeRegistry,
      async (bean: Bean, beanDefinition: BeanDefinition, instance: any) => {
        await this.postProcess(bean, beanDefinition, instance)
      }
    )
  }

  private async getDependencies (
    entry: BeanDefinition,
    beanDefinitions: BeanDefinition[]
  ): Promise<Bean[]> {
    if (!entry.isClass()) {
      return []
    }
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

  private async getDependecySafe (
    property: Property,
    parentId: string,
    beanDefinitions: BeanDefinition[]
  ): Promise<Bean> {
    if (property.value != null) {
      return new ValueBean(property.value)
    }
    await this.ensureDependencyIsPresent(property, parentId, beanDefinitions)
    const reference = property.ref
    if (reference == null) {
      throw new Error()
    }
    return await this.context.getBean(reference)
  }

  private async ensureDependencyIsPresent (
    property: Property,
    parentId: string,
    beanDefinitions: BeanDefinition[]
  ): Promise<void> {
    const reference = property.ref
    if (reference != null && !(await this.hasDependency(reference))) {
      await this.registerDependency(reference, parentId, beanDefinitions)
    }
  }

  private async hasDependency (id: string): Promise<boolean> {
    return await this.context.has(id)
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
    this.context.put([bean])
  }

  private async postProcess (bean: Bean, beanDefinition: BeanDefinition, instance: any): Promise<Bean[]> {
    for (const postProcessor of this.postProcessors) {
      await postProcessor.postProcess(beanDefinition, bean, instance)
    }
    return [bean]
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

  private throwDependencyError (err: Error | RethrowableError, id: string): void {
    if (err instanceof RethrowableError && err.isRethrowable) {
      throw err
    }
    throw new DependencyRegisterError(id, err)
  }
}
