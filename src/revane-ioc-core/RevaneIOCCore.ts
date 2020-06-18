import BeanLoader from './BeanLoader'
import Options from './Options'
import Loader from './Loader'

import * as flat from 'array.prototype.flat'
import BeanTypeRegistry from './context/bean/BeanTypeRegistry'
import { ContextPlugin } from './context/ContextPlugin'
import { DefaultApplicationContext } from './DefaultApplicationContext'
import { BeanFactory } from './BeanFactory'
import { BeanAnnotationBeanFactoryPostProcessor } from './postProcessors/BeanAnnotationBeanFactoryPostProcessor'
import { ModuleLoaderBeanFactoryPreProcessor } from './preProcessors/ModuleLoaderFactoryPreProcessor'
import { ApplicationContext } from './ApplicationContext'
import { PathBeanFactoryPreProcessor } from './preProcessors/PathBeanFactoryPreProcessor'
import { ScopeBeanFactoryPreProcessor } from './preProcessors/ScopeBeanFactoryPreProcessor'
import { BeanFactoryPostProcessor } from './postProcessors/BeanFactoryPostProcessor'
import { BeanFactoryPreProcessor } from './preProcessors/BeanFactoryPreProcessor'

export default class RevaneIOCCore {
  protected options: Options
  private context: ApplicationContext = new DefaultApplicationContext()
  private beanTypeRegistry: BeanTypeRegistry
  private plugins: Map<string, (Loader | ContextPlugin | BeanFactoryPostProcessor | BeanFactoryPreProcessor)[]> = new Map()

  constructor (options: Options, beanTypeRegistry: BeanTypeRegistry) {
    this.options = options
    this.beanTypeRegistry = beanTypeRegistry
  }

  public addPlugin (name: string, plugin: Loader | ContextPlugin | BeanFactoryPostProcessor | BeanFactoryPreProcessor) {
    let pluginsByName = this.plugins.get(name)
    if (!pluginsByName) {
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
        ...(this.plugins.get('beanFactoryPreProcessor') || []) as BeanFactoryPreProcessor[]
      ],
      [
        new BeanAnnotationBeanFactoryPostProcessor(),
        ...this.plugins.get('beanFactoryPostProcessor') as BeanFactoryPostProcessor[]
      ],
      this.context as DefaultApplicationContext,
      this.beanTypeRegistry,
      this.options,
      this.plugins
    )
    const loaders: Loader[] = this.plugins.get('loader') as Loader[]
    const beanLoader = new BeanLoader(loaders)
    const beanDefinitions = await beanLoader.getBeanDefinitions(this.options)
    await beanFactory.process(flat(beanDefinitions))
  }

  public async get (id: string): Promise<any> {
    return this.context.get(id)
  }

  public async has (id: string): Promise<boolean> {
    return this.context.has(id)
  }

  public async getMultiple (ids: string[]): Promise<any[]> {
    const beans = []
    for (const id of ids) {
      const bean = await this.get(id)
      beans.push(bean)
    }
    return beans
  }

  public async getByType (type: string): Promise<any[]> {
    return this.context.getByType(type)
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
