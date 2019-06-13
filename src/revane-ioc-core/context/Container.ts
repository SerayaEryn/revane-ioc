import BeanDefinition from '../BeanDefinition'
import Bean from './bean/Bean'
import ValueBean from './bean/ValueBean'
import DependencyNotFoundError from './errors/DependencyNotFoundError'
import DependencyRegisterError from './errors/DependencyRegisterError'
import InvalidScopeError from './errors/InvalidScopeError'
import NotFoundError from './errors/NotFoundError'
import BeanTypeRegistry from './BeanTypeRegistry'
import SingletonBean from '../../revane-ioc/bean/SingletonBean'
import 'reflect-metadata'

type Property = {
  value?: string
  ref?: string
}

export default class Container {
  private entries: BeanDefinition[]
  private beans: Map<string, Bean>
  private beanTypeRegistry: BeanTypeRegistry
  private plugins: any

  constructor (entries: BeanDefinition[], beanTypeRegistry: BeanTypeRegistry, plugins: any) {
    this.entries = entries
    this.plugins = plugins
    this.beans = new Map()
    this.beanTypeRegistry = beanTypeRegistry
  }

  public async initialize (): Promise<void> {
    if (this.plugins && this.plugins.initialize) {
      this.plugins.initialize(this)
    }
    for (const entry of this.entries) {
      if (!this.has(entry.id)) {
        await this.registerBean(entry)
      }
    }
    this.clearEntries()
  }

  public get (id: string): any {
    const bean = this.getStrict(id)
    return bean.getInstance()
  }

  public getByType (type: string): any[] {
    const beansByType = []
    for (const bean of this.beans.values()) {
      if (bean.type === type) {
        beansByType.push(bean.getInstance())
      }
    }
    return beansByType
  }

  public has (id: string): boolean {
    return this.beans.has(id)
  }

  public async tearDown (): Promise<void> {
    for (const bean of this.beans.values()) {
      await bean.preDestroy()
    }
  }

  private getStrict (id: string): Bean {
    const bean: Bean = this.beans.get(id)
    if (!bean) {
      throw new NotFoundError(id)
    }
    return bean
  }

  private async registerBean (entry: BeanDefinition): Promise<void> {
    await this.loadAfter(entry)
    if (this.has(entry.id)) {
      return
    }
    const Clazz = this.getClass(entry)
    const bean: Bean = await this.createBean(entry, Clazz)
    this.set(entry.id, bean)
    await bean.postConstruct()
      .catch((error) => {
        throw new DependencyRegisterError(entry.id, error)
      })
  }

  private clearEntries (): void {
    this.entries = null
  }

  private set (id: string, bean: Bean): void {
    this.beans.set(id, bean)
  }

  private getClass (entry: BeanDefinition) {
    if (entry.instance) {
      return entry.instance
    }
    const Clazz = require(entry.path)
    if (Clazz.default) {
      return Clazz.default
    }
    return Clazz
  }

  private createBean (entry: BeanDefinition, Clazz: any): Promise<Bean> {
    const BeanForScope = this.beanTypeRegistry.get(entry.scope)
    if (BeanForScope) {
      return this.createBeanForScope(BeanForScope, entry, Clazz)
    }
    throw new InvalidScopeError(entry.scope)
  }

  private async createBeanForScope (BeanForScope: any, entry: BeanDefinition, Clazz: any): Promise<any> {
    const isClazz = this.isClass(Clazz)
    const dependencies = await this.getDependencies(isClazz, entry)
    const inject = await this.getInjectables(entry)

    const beans = Clazz.prototype ? Reflect.getMetadata('beans', Clazz.prototype) || [] : []
    for (const bean of beans) {
      const beanDefinition: BeanDefinition = {
        id: bean.id,
        type: bean.type,
        scope: 'singleton',
        properties: [],
        path: null,
        class: null,
        options: { inject: null }
      }
      const beanFromFactory = new SingletonBean(bean.instance, beanDefinition, false, { dependencies: [] })
      this.set(bean.id, beanFromFactory)
    }

    return new BeanForScope(Clazz, entry, isClazz, { dependencies, inject })
  }

  private async getInjectables (entry: BeanDefinition) {
    if (entry.options && entry.options.inject) {
      return Promise.all(entry.options.inject.map(async (id) => {
        return {
          id,
          bean: await this.getDependecySafe({ ref: id }, entry.id)
        }
      }))
    }
    return Promise.resolve([])
  }

  private async getDependencies (isClass: boolean, entry: BeanDefinition): Promise<Bean[]> {
    if (isClass) {
      return Promise.all(entry.properties.map(async (property: Property | Property) => {
        return this.getDependecySafe(property, entry.id)
      }))
    }
    return Promise.resolve([])
  }

  private async loadAfter (entry: BeanDefinition): Promise<Bean[]> {
    return Promise.all((entry.loadAfter || []).map(async (property: Property | Property) => {
      return this.getDependecySafe(property, entry.id)
    }))
  }

  private async getDependecySafe (property: Property, parentId: string): Promise<Bean> {
    if (property.value) {
      return new ValueBean(property.value)
    }
    await this.ensureDependencyIsPresent(property, parentId)
    return this.getStrict(property.ref)
  }

  private async ensureDependencyIsPresent (property: Property, parentId: string): Promise<void> {
    if (!this.hasDependency(property.ref)) {
      await this.registerDependency(property.ref, parentId)
    }
  }

  private hasDependency (id: string): boolean {
    return this.has(id)
  }

  private async registerDependency (id: string, parentId: string): Promise<void> {
    try {
      await this.findAndRegisterBean(id, parentId)
    } catch (err) {
      this.throwDependencyError(err, id)
    }
  }

  private async findAndRegisterBean (id: string, parentId: string): Promise<void> {
    const entry = this.findEntry(id, parentId)
    await this.registerBean(entry)
  }

  private throwDependencyError (err: Error, id: string): void {
    if (err instanceof DependencyNotFoundError) {
      throw err
    }
    throw new DependencyRegisterError(id, err)
  }

  private findEntry (id: string, parentId: string): BeanDefinition {
    for (const entry of this.entries) {
      if (entry.id === id) {
        return entry
      }
    }
    throw new DependencyNotFoundError(id, parentId)
  }

  private isClass (Clazz: any): boolean {
    try {
      Object.defineProperty(Clazz, 'prototype', {
        writable: true
      })
      return false
    } catch (err) {
      return typeof Clazz === 'function'
    }
  }
}
