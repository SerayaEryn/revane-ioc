import BeanLoader from './BeanLoader'
import Options from './Options'
import Loader from './Loader'

import BeanTypeRegistry from './context/bean/BeanTypeRegistry'
import { ContextPlugin } from './context/ContextPlugin'
import { DefaultApplicationContext } from './DefaultApplicationContext'
import { BeanFactory } from './BeanFactory'
import { ModuleLoaderBeanFactoryPreProcessor } from './preProcessors/ModuleLoaderFactoryPreProcessor'
import { ApplicationContext } from './ApplicationContext'
import { PathBeanFactoryPreProcessor } from './preProcessors/PathBeanFactoryPreProcessor'
import { ScopeBeanFactoryPreProcessor } from './preProcessors/ScopeBeanFactoryPreProcessor'
import { BeanFactoryPostProcessor } from './postProcessors/BeanFactoryPostProcessor'
import { BeanFactoryPreProcessor } from './preProcessors/BeanFactoryPreProcessor'
import { ConditionalsBeanFactoryPreProcessor } from './preProcessors/ConditionalsBeanFactoryPreProcessor'
import { DependencyService } from './dependencies/DependencyService'
import { BeanDependencyResolver } from './dependencies/BeanDependencyResolver'
import { ValueDependencyResolver } from './dependencies/ValueDependencyResolver'
import { DependencyResolver } from './dependencies/DependecyResolver'

export default class RevaneIOCCore {
  protected options: Options
  private readonly context: ApplicationContext = new DefaultApplicationContext()
  private readonly beanTypeRegistry: BeanTypeRegistry
  private readonly plugins: Map<string, Array<Loader | ContextPlugin | BeanFactoryPostProcessor | BeanFactoryPreProcessor | DependencyResolver>> = new Map()

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

  public async get (id: string): Promise<any> {
    return await this.context.get(id)
  }

  public async has (id: string): Promise<boolean> {
    return await this.context.has(id)
  }

  public async getMultiple (ids: string[]): Promise<any[]> {
    const beans: any[] = []
    for (const id of ids) {
      const bean = await this.get(id)
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
