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
import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition'
import Loader from '../revane-ioc-core/Loader'
import {
  Configuration,
  Repository,
  Service,
  Component,
  Controller,
  Scope,
  Bean,
  Scheduler
} from './decorators/Decorators'
import { ConfigurationContextPlugin } from '../revane-configuration/ConfigurationContextPlugin'
import { ConfigurationOptions, RevaneConfiguration } from '../revane-configuration/RevaneConfiguration'
import { ContextPlugin } from '../revane-ioc-core/context/ContextPlugin'
import { ConfigurationPropertiesPostProcessor } from '../revane-configuration/ConfigurationPropertiesPostProcessor'
import { ConfigurationPropertiesPreProcessor } from '../revane-configuration/ConfigurationPropertiesPreProcessor'
import { ApplicationContext } from '../revane-ioc-core/ApplicationContext'
import { ConfigurationProperties } from '../revane-configuration/ConfigurationProperties'
import { JsonLoadingStrategy } from '../revane-configuration/loading/JsonLoadingStrategy'
import { Scheduled } from '../revane-scheduler/Scheduled'
import { SchedulerBeanPostProcessor } from '../revane-scheduler/SchedulerBeanPostProcessor'
import { SchedulingService } from '../revane-scheduler/SchedulingService'
import { join } from 'path'

export {
  DefaultBeanDefinition as BeanDefinition,
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
  Scheduler,
  Scope,
  Bean,
  Configuration,
  ConfigurationProperties,
  ContextPlugin,
  ApplicationContext,
  Scheduled
}

export default class RevaneIOC {
  private revaneCore: RevaneCore
  private options: Options
  private initialized: boolean = false
  private configuration: RevaneConfiguration
  private schedulingService: SchedulingService

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
    if (!this.options.scheduling) {
      this.options.scheduling = { enabled: true }
    }
    if (this.options.scheduling.enabled !== true) {
      this.options.scheduling.enabled = false
    }

    this.options.profile = this.options.profile || process.env.REVANE_PROFILE

    this.configuration = new RevaneConfiguration(
      new ConfigurationOptions(
        this.options.profile,
        this.configPath(),
        this.options.configuration.required,
        this.options.configuration.disabled,
        [
          new JsonLoadingStrategy()
        ]
      )
    )
  }

  private configPath (): string {
    if (this.options.configuration.directory && this.options.configuration.directory.startsWith('/')) {
      return this.options.configuration.directory
    }
    return join(this.options.basePackage, this.options.configuration.directory || '/config')
  }

  public async initialize (): Promise<void> {
    await this.configuration.init()
    this.loadOptionsFromConfiguration()
    const coreOptions: CoreOptions = this.prepareCoreOptions(this.options)
    const beanTypeRegistry = this.beanTypeRegistry()
    this.revaneCore = new RevaneCore(coreOptions, beanTypeRegistry)
    await this.addDefaultPlugins()
    this.addPlugins()
    await this.revaneCore.initialize()
    this.initialized = true
  }

  private loadOptionsFromConfiguration () {
    if (this.configuration.has('revane.scheduling.enabled')) {
      const schedulerDisabled = this.configuration.getBoolean('revane.scheduling.enabled')
      this.options.scheduling.enabled = schedulerDisabled
    }
    if (this.configuration.has('revane.main.allow-bean-definition-overriding')) {
      const allowRedefinition = this.configuration.getBoolean('revane.main.allow-bean-definition-overriding')
      this.options.noRedefinition = !allowRedefinition
    }
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
    await this.schedulingService.close()
    await this.revaneCore.close()
  }

  public setParent (parent: RevaneIOC): void {
    this.revaneCore.setParent(parent.getContext())
  }

  public getContext (): ApplicationContext {
    return this.revaneCore.getContext()
  }

  private async addDefaultPlugins () {
    this.revaneCore.addPlugin('loader', this.getLoader('xml') || new XmlFileLoader())
    this.revaneCore.addPlugin('loader', this.getLoader('json') || new JsonFileLoader())
    this.revaneCore.addPlugin('loader', this.getLoader('scan') || new ComponentScanLoader())
    const configOptions: ConfigurationOptions = this.prepareConfigOptions(this.options)
    const configurationContextPlugin = new ConfigurationContextPlugin(configOptions, this.configuration)
    this.revaneCore.addPlugin('contextInitialization', configurationContextPlugin)
    this.revaneCore.addPlugin('configuration', configurationContextPlugin)
    if (!this.options.configuration.disabled) {
      this.revaneCore.addPlugin(
        'beanFactoryPostProcessor',
        new ConfigurationPropertiesPostProcessor(this.configuration)
      )
      this.revaneCore.addPlugin('beanFactoryPreProcessor', new ConfigurationPropertiesPreProcessor())
    }
    this.schedulingService = new SchedulingService()
    this.revaneCore.addPlugin(
      'beanFactoryPostProcessor',
      new SchedulerBeanPostProcessor(this.schedulingService, this.options.scheduling.enabled)
    )
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
      options.configuration.disabled,
      [ new JsonLoadingStrategy() ]
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
