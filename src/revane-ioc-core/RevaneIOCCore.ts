import BeanLoader from './BeanLoader'
import Context from './context/Context'
import Options from './Options'
import Loader from './Loader'

import * as flat from 'array.prototype.flat'
import BeanTypeRegistry from './context/BeanTypeRegistry'
import { ContextPlugin } from './context/ContextPlugin'

export default class RevaneIOCCore {
  protected options: Options
  private context: Context
  private beanTypeRegistry: BeanTypeRegistry
  private plugins: Map<string, (Loader | ContextPlugin)[]> = new Map()

  constructor (options: Options, beanTypeRegistry: BeanTypeRegistry) {
    this.options = options
    this.beanTypeRegistry = beanTypeRegistry
  }

  public addPlugin (name: string, plugin: Loader | ContextPlugin) {
    let pluginsByName = this.plugins.get(name)
    if (!pluginsByName) {
      pluginsByName = []
    }
    pluginsByName.push(plugin)
    this.plugins.set(name, pluginsByName)
  }

  public async initialize (): Promise<void> {
    this.context = new Context(this.options, this.beanTypeRegistry, this.plugins)
    const loaders: Loader[] = this.plugins.get('loader') as Loader[]
    const beanLoader = new BeanLoader(loaders)
    const beanDefinitions = await beanLoader.getBeanDefinitions(this.options)
    this.context.addBeanDefinitions(flat(beanDefinitions))
    await this.context.initialize()
  }

  public async get (id: string): Promise<any> {
    return this.context.get(id)
  }

  public async has (id: string): Promise<boolean> {
    return this.context.has(id)
  }

  public async getMultiple (ids: string[]): Promise<any[]> {
    return this.context.getMultiple(ids)
  }

  public async getByType (type: string): Promise<any[]> {
    return this.context.getByType(type)
  }

  public async tearDown (): Promise<void> {
    await this.context.tearDown()
  }
}
