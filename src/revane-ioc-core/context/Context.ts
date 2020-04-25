import * as path from 'path'
import BeanDefinition from '../BeanDefinition'
import Options from '../Options'
import Container from './Container'
import BeanDefinedTwiceError from './errors/BeanDefinedTwiceError'
import ContextNotInitializedError from './errors/ContextNotInitializedError'
import BeanTypeRegistry from './BeanTypeRegistry'
import { ContextPlugin } from './ContextPlugin'
import Loader from '../Loader'
import { BeanProvider } from './BeanProvider'
import { ConfigurationProvider } from './ConfigurationProvider'

export default class Context {
  private options: Options
  private beanDefinitions: Map<string, BeanDefinition>
  private container: Container
  private initialized: boolean = false
  private beanTypeRegistry: BeanTypeRegistry
  private plugins: Map<string, (Loader | ContextPlugin)[] | ConfigurationProvider>

  constructor (
    options: Options,
    beanTypeRegistry: BeanTypeRegistry,
    plugins: Map<string, (Loader | ContextPlugin)[] | ConfigurationProvider>
  ) {
    this.options = options
    this.plugins = plugins
    this.beanDefinitions = new Map()
    this.beanTypeRegistry = beanTypeRegistry
  }

  public async initialize (): Promise<void> {
    const configurationProvider = (this.plugins.get('configuration') || [])[0] as ConfigurationProvider
    let configuration
    if (configurationProvider) {
      await configurationProvider.init()
      configuration = configurationProvider.provide()
    }
    for (const contextPlugin of this.plugins.get('contextInitialization') as ContextPlugin[] || []) {
      this.beanDefinitions = await contextPlugin.plugin(
        this.beanDefinitions, new BeanProvider(this))
    }
    const entries = [...this.beanDefinitions.values()]
    this.container = new Container(entries, this.beanTypeRegistry, configuration)
    await this.container.initialize()
    this.beanDefinitions = null
    this.initialized = true
  }

  public hasBeanDefinintion (key: string) {
    return this.beanDefinitions.get(key) != null
  }

  public addBeanDefinition (beanDefinition: BeanDefinition): void {
    const exitingBeanDefininaton = this.beanDefinitions.get(beanDefinition.id)
    if (exitingBeanDefininaton && this.options.noRedefinition) {
      throw new BeanDefinedTwiceError(exitingBeanDefininaton.id)
    }
    beanDefinition.scope = beanDefinition.scope || this.options.defaultScope,
    beanDefinition.path = this.getPath(beanDefinition),
    beanDefinition.properties = beanDefinition.properties || [],
    beanDefinition.type = beanDefinition.type
    this.beanDefinitions.set(beanDefinition.id, beanDefinition)
  }

  public addBeanDefinitions (beanDefinitions: BeanDefinition[]): void {
    for (const beanDefinition of beanDefinitions) {
      this.addBeanDefinition(beanDefinition)
    }
  }

  public async get (id: string): Promise<any> {
    if (!this.initialized) {
      throw new ContextNotInitializedError()
    }
    return this.container.get(id)
  }

  public async has (id: string): Promise<boolean> {
    if (!this.initialized) {
      throw new ContextNotInitializedError()
    }
    return this.container.has(id)
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
    if (!this.initialized) {
      throw new ContextNotInitializedError()
    }
    return this.container.getByType(type)
  }

  public async tearDown (): Promise<void> {
    await this.container.tearDown()
  }

  private getPath (beanDefinition: BeanDefinition): string {
    if (!this.isRelative(beanDefinition) || this.isAbsolute(beanDefinition)) {
      return beanDefinition.class
    }
    return path.join(this.options.basePackage, beanDefinition.class)
  }

  private isAbsolute (beanDefinition: BeanDefinition): boolean {
    return beanDefinition.class.startsWith('/')
  }

  private isRelative (beanDefinition: BeanDefinition): boolean {
    return beanDefinition.class.startsWith('.')
  }
}
