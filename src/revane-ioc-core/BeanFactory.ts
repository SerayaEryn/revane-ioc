import { BeanFactoryPostProcessor } from './postProcessors/BeanFactoryPostProcessor'
import { DefaultApplicationContext } from './DefaultApplicationContext'
import Bean from './context/bean/Bean'
import DependencyRegisterError from './context/errors/DependencyRegisterError'
import BeanTypeRegistry from './context/bean/BeanTypeRegistry'
import DependencyNotFoundError from './context/errors/DependencyNotFoundError'
import Options from './Options'
import BeanDefinedTwiceError from './context/errors/BeanDefinedTwiceError'
import { BeanFactoryPreProcessor } from './preProcessors/BeanFactoryPreProcessor'
import { BeanDefinition } from './BeanDefinition'
import { RethrowableError } from './RethrowableError'
import { DependencyService } from './dependencies/DependencyService'
import { DependencyDefinition } from './dependencies/DependencyDefinition'

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
    plugins: Map<string, any>,
    private readonly dependencyService: DependencyService
  ) {
    this.preProcessors = preProcessors
    this.postProcessors = postProcessors
    this.context = context
    this.beanTypeRegistry = beanTypeRegistry
    this.options = options
    this.registerDependency = this.registerDependency.bind(this)
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
      if (!await this.context.has(preProcessedBeanDefinition.id)) {
        const bean = await this.registerBean(preProcessedBeanDefinition, preprocessed)
        this.context.put([bean])
      }
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
    beanDefinition: BeanDefinition,
    beanDefinitions: BeanDefinition[]
  ): Promise<Bean[]> {
    if (!beanDefinition.isClass()) {
      return []
    }
    const dependencies: Bean[] = []
    for (const dependency of beanDefinition.dependencyIds) {
      const dependencyForBean = await this.dependencyService.getDependency(
        dependency,
        beanDefinition.id,
        beanDefinitions,
        this.registerDependency
      )
      dependencies.push(dependencyForBean)
    }
    return dependencies
  }

  private async registerDependency (
    dependency: DependencyDefinition,
    parentId: string,
    beanDefinitions: BeanDefinition[]
  ): Promise<void> {
    const id = dependency.value as string
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
    const beanDefinition = this.findEntry(id, parentId, beanDefinitions)
    const bean = await this.registerBean(beanDefinition, beanDefinitions)
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
