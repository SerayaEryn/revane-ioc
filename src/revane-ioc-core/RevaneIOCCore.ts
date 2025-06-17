import BeanLoader from './BeanLoader.js'
import Options from './Options.js'
import Loader from './Loader.js'

import BeanTypeRegistry from './context/bean/BeanTypeRegistry.js'
import { ContextPlugin } from './context/ContextPlugin.js'
import { DefaultApplicationContext } from './DefaultApplicationContext.js'
import { BeanFactory } from './BeanFactory.js'
import { ModuleLoaderBeanFactoryPreProcessor } from './preProcessors/ModuleLoaderFactoryPreProcessor.js'
import { ApplicationContext } from './ApplicationContext.js'
import { PathBeanFactoryPreProcessor } from './preProcessors/PathBeanFactoryPreProcessor.js'
import { ScopeBeanFactoryPreProcessor } from './preProcessors/ScopeBeanFactoryPreProcessor.js'
import { BeanFactoryPostProcessor } from './postProcessors/BeanFactoryPostProcessor.js'
import { BeanFactoryPreProcessor } from './preProcessors/BeanFactoryPreProcessor.js'
import { ConditionalsBeanFactoryPreProcessor } from './preProcessors/ConditionalsBeanFactoryPreProcessor.js'
import { DependencyService } from './dependencies/DependencyService.js'
import { BeanDependencyResolver } from './dependencies/BeanDependencyResolver.js'
import { ValueDependencyResolver } from './dependencies/ValueDependencyResolver.js'
import { DependencyResolver } from './dependencies/DependencyResolver.js'

export default class RevaneIOCCore {
  protected options: Options
  private readonly context: ApplicationContext = new DefaultApplicationContext()
  private readonly beanTypeRegistry: BeanTypeRegistry
  private readonly plugins = new Map<string, (Loader | ContextPlugin | BeanFactoryPostProcessor | BeanFactoryPreProcessor | DependencyResolver)[]>()

  constructor (options: Options, beanTypeRegistry: BeanTypeRegistry) {
    this.options = options
    this.beanTypeRegistry = beanTypeRegistry
  }

  public addPlugin (name: string, plugin: Loader | ContextPlugin | BeanFactoryPostProcessor | BeanFactoryPreProcessor | DependencyResolver): void {
    let pluginsByName = this.plugins.get(name)
    if (pluginsByName == null) {
      pluginsByName = []
    }
    pluginsByName.push(plugin)
    this.plugins.set(name, pluginsByName)
  }

  public async initialize (): Promise<void> {
    const beanFactory = new BeanFactory(
      [
        new ScopeBeanFactoryPreProcessor(this.options),
        new PathBeanFactoryPreProcessor(this.options),
        new ModuleLoaderBeanFactoryPreProcessor(),
        ...this.plugins.get('beanFactoryPreProcessor') as BeanFactoryPreProcessor[] ?? [],
        new ConditionalsBeanFactoryPreProcessor()
      ],
      [
        ...this.plugins.get('beanFactoryPostProcessor') as BeanFactoryPostProcessor[] ?? []
      ],
      this.context as DefaultApplicationContext,
      this.beanTypeRegistry,
      this.options,
      this.plugins,
      new DependencyService(
        ([
          new BeanDependencyResolver(this.context as DefaultApplicationContext),
          new ValueDependencyResolver()
        ] as DependencyResolver[])
          .concat(this.plugins.get('dependencyResolver') as DependencyResolver[] ?? [])
      )
    )
    const loaders: Loader[] = this.plugins.get('loader') as Loader[] ?? []
    const beanLoader = new BeanLoader(loaders)
    const beanDefinitions: any = await beanLoader.getBeanDefinitions(this.options)
    await beanFactory.process(beanDefinitions.flat())
  }

  public async getById (id: string): Promise<any> {
    return await this.context.getById(id)
  }

  public async hasById (id: string): Promise<boolean> {
    return await this.context.hasById(id)
  }

  public async getMultipleById (ids: string[]): Promise<any[]> {
    const beans: any[] = []
    for (const id of ids) {
      const bean = await this.getById(id)
      beans.push(bean)
    }
    return beans
  }

  public async getByType (type: string): Promise<any[]> {
    return await this.context.getByType(type)
  }

  public async close (): Promise<void> {
    await this.context.close()
  }

  public getContext (): ApplicationContext {
    return this.context
  }

  public setParent (context: ApplicationContext): void {
    this.context.setParent(context)
  }
}
