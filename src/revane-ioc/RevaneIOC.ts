import CoreOptions, { LoaderOptions } from '../revane-ioc-core/Options'
import RevaneCore from '../revane-ioc-core/RevaneIOCCore'
import DefaultBeanTypeRegistry from '../revane-ioc-core/context/DefaultBeanTypeRegistry'

import JsonFileLoader from './loaders/JsonFileLoader'
import XmlFileLoader from './loaders/XmlFileLoader'
import ComponentScanLoader from './loaders/ComponentScanLoader'
import UnknownEndingError from './UnknownEndingError'
import PrototypeBean from './bean/PrototypeBean'
import SingletonBean from './bean/SingletonBean'
import Options from './Options'
import NotInitializedError from './NotInitializedError'
import BeanDefinition from '../revane-ioc-core/BeanDefinition'
import Loader from '../revane-ioc-core/Loader'
import { BeanProvider } from '../revane-ioc-core/context/Container'

export * from './loaders/RegexFilter'
export * from './decorators/Decorators'
export * from './Options'
export {
  BeanDefinition,
  Loader,
  BeanProvider,
  XmlFileLoader,
  ComponentScanLoader,
  JsonFileLoader
}

export default class RevaneIOC {
  private revaneCore: RevaneCore
  private options: Options
  private initialized: boolean = false

  constructor (options: Options) {
    this.options = options
    if (!this.options.plugins) {
      this.options.plugins = {}
    }
    if (!this.options.plugins.loaders) {
      this.options.plugins.loaders = []
    }
  }

  public async initialize (): Promise<void> {
    const coreOptions: CoreOptions = this.prepareOptions(this.options)
    const beanTypeRegistry = new DefaultBeanTypeRegistry()
    beanTypeRegistry.register(SingletonBean)
    beanTypeRegistry.register(PrototypeBean)
    this.revaneCore = new RevaneCore(coreOptions, beanTypeRegistry)
    this.revaneCore.addPlugin('loader', this.getLoaderType('xml') || XmlFileLoader)
    this.revaneCore.addPlugin('loader', this.getLoaderType('json') || JsonFileLoader)
    this.revaneCore.addPlugin('loader', this.getLoaderType('scan') || ComponentScanLoader)
    for (const loader of this.options.plugins.loaders) {
      if (!['xml', 'json', 'scan'].includes(loader.type)) {
        this.revaneCore.addPlugin('loader', loader)
      }
    }
    await this.revaneCore.initialize()
    this.initialized = true
  }

  private getLoaderType (type: string) {
    for (const LoaderType of this.options.plugins.loaders) {
      if (LoaderType.type === type) {
        return LoaderType
      }
    }
    return null
  }

  public get (id: string): any {
    this.checkIfInitialized()
    return this.revaneCore.get(id)
  }

  public has (id: string): boolean {
    this.checkIfInitialized()
    return this.revaneCore.has(id)
  }

  public getMultiple (ids: string[]): any[] {
    this.checkIfInitialized()
    return this.revaneCore.getMultiple(ids)
  }

  public getByType (type: string): any[] {
    this.checkIfInitialized()
    return this.revaneCore.getByType(type)
  }

  public async tearDown (): Promise<void> {
    await this.revaneCore.tearDown()
  }

  private prepareOptions (options: Options): CoreOptions {
    const coreOptions: CoreOptions = new CoreOptions()
    coreOptions.loaderOptions = options.loaderOptions || []
    this.checkForUnknownEndings(coreOptions.loaderOptions)
    coreOptions.defaultScope = 'singleton'
    coreOptions.basePackage = options.basePackage
    coreOptions.plugins = {
      initialize: options.plugins.containterInitialize
    }
    return coreOptions
  }

  private checkForUnknownEndings (files: LoaderOptions[]): void {
    const loaderClasses = [
      XmlFileLoader, JsonFileLoader, ComponentScanLoader
    ].concat(this.options.plugins.loaders)
    for (const file of files) {
      const relevant: Array<boolean> = []
      for (const loaderClass of loaderClasses) {
        relevant.push(loaderClass.isRelevant(file))
      }
      if (!relevant.includes(true)) {
        throw new UnknownEndingError()
      }
    }
  }

  private checkIfInitialized (): void {
    if (!this.initialized) {
      throw new NotInitializedError()
    }
  }
}
