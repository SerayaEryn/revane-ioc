import CoreOptions, { LoaderOptions, RegexFilter } from '../revane-ioc-core/Options'
import RevaneCore from '../revane-ioc-core/RevaneIOCCore'
import DefaultBeanTypeRegistry from '../revane-ioc-core/context/bean/DefaultBeanTypeRegistry'

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
import {
  Configuration,
  Repository,
  Service,
  Component,
  Controller,
  Scope,
  Bean
} from './decorators/Decorators'
import { ConfigurationContextPlugin } from '../revane-configuration/ConfigurationContextPlugin'
import { ConfigurationOptions, RevaneConfiguration } from '../revane-configuration/RevaneConfiguration'
import { ContextPlugin } from '../revane-ioc-core/context/ContextPlugin'
import { ConfigurationPropertiesPostProcessor } from '../revane-configuration/ConfigurationPropertiesPostProcessor'
import { ConfigurationPropertiesPreProcessor } from '../revane-configuration/ConfigurationPropertiesPreProcessor'
import { ApplicationContext } from '../revane-ioc-core/ApplicationContext'
import { ConfigurationProperties } from '../revane-configuration/ConfigurationProperties'

export {
  BeanDefinition,
  Loader,
  XmlFileLoader,
  ComponentScanLoader,
  JsonFileLoader,
  RegexFilter,
  Options,
  LoaderOptions,
  Repository,
  Service,
  Component,
  Controller,
  Scope,
  Bean,
  Configuration,
  ConfigurationProperties,
  ContextPlugin,
  ApplicationContext
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
    if (!this.options.plugins.contextInitialization) {
      this.options.plugins.contextInitialization = []
    }
  }

  public async initialize (): Promise<void> {
    const coreOptions: CoreOptions = this.prepareCoreOptions(this.options)
    const beanTypeRegistry = this.beanTypeRegistry()
    this.revaneCore = new RevaneCore(coreOptions, beanTypeRegistry)
    await this.addDefaultPlugins()
    this.addPlugins()
    await this.revaneCore.initialize()
    this.initialized = true
  }

  public async get (id: string): Promise<any> {
    this.checkIfInitialized()
    return this.revaneCore.get(id)
  }

  public async has (id: string): Promise<boolean> {
    this.checkIfInitialized()
    return this.revaneCore.has(id)
  }

  public async getMultiple (ids: string[]): Promise<any[]> {
    this.checkIfInitialized()
    return this.revaneCore.getMultiple(ids)
  }

  public async getByType (type: string): Promise<any[]> {
    this.checkIfInitialized()
    return this.revaneCore.getByType(type)
  }

  public async close (): Promise<void> {
    await this.revaneCore.close()
  }

  private async addDefaultPlugins () {
    this.revaneCore.addPlugin('loader', this.getLoader('xml') || new XmlFileLoader())
    this.revaneCore.addPlugin('loader', this.getLoader('json') || new JsonFileLoader())
    this.revaneCore.addPlugin('loader', this.getLoader('scan') || new ComponentScanLoader())
    const configOptions: ConfigurationOptions = this.prepareConfigOptions(this.options)
    const configurationContextPlugin = new ConfigurationContextPlugin(configOptions)
    this.revaneCore.addPlugin('contextInitialization', configurationContextPlugin)
    this.revaneCore.addPlugin('configuration', configurationContextPlugin)
    const configuration = new RevaneConfiguration(
      new ConfigurationOptions(
        this.options.profile,
        this.options.configuration.directory,
        this.options.configuration.required,
        this.options.configuration.disabled
      )
    )
    await configuration.init()
    if (!this.options.configuration.disabled) {
      this.revaneCore.addPlugin(
        'beanFactoryPostProcessor',
        new ConfigurationPropertiesPostProcessor(
          configuration
        )
      )
      this.revaneCore.addPlugin('beanFactoryPreProcessor', new ConfigurationPropertiesPreProcessor())
    }
  }

  private addPlugins () {
    for (const loader of this.options.plugins.loaders) {
      if (!['xml', 'json', 'scan'].includes(loader.type())) {
        this.revaneCore.addPlugin('loader', loader)
      }
    }
    for (const plugin of this.options.plugins.contextInitialization) {
      this.revaneCore.addPlugin('contextInitialization', plugin)
    }
  }

  private getLoader (type: string): Loader {
    for (const loader of this.options.plugins.loaders) {
      if (loader.type() === type) {
        return loader
      }
    }
    return null
  }

  private beanTypeRegistry () {
    const beanTypeRegistry = new DefaultBeanTypeRegistry()
    beanTypeRegistry.register(SingletonBean)
    beanTypeRegistry.register(PrototypeBean)
    return beanTypeRegistry
  }

  private prepareCoreOptions (options: Options): CoreOptions {
    const coreOptions: CoreOptions = new CoreOptions()
    coreOptions.loaderOptions = options.loaderOptions || []
    this.checkForUnknownEndings(coreOptions.loaderOptions)
    coreOptions.defaultScope = 'singleton'
    coreOptions.basePackage = options.basePackage
    return coreOptions
  }

  private prepareConfigOptions (options: Options): ConfigurationOptions {
    return new ConfigurationOptions(
      options.profile,
      options.configuration.directory,
      options.configuration.required,
      options.configuration.disabled
    )
  }

  private checkForUnknownEndings (files: LoaderOptions[]): void {
    const loaders = [
      new XmlFileLoader(), new JsonFileLoader(), new ComponentScanLoader()
    ].concat(this.options.plugins.loaders)
    for (const file of files) {
      const relevant: Array<boolean> = []
      for (const loader of loaders) {
        relevant.push(loader.isRelevant(file))
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
