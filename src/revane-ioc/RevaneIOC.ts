import { LoaderOptions, RegexFilter } from '../revane-ioc-core/Options'
import RevaneCore from '../revane-ioc-core/RevaneIOCCore'
import DefaultBeanTypeRegistry from '../revane-ioc-core/context/bean/DefaultBeanTypeRegistry'

import JsonFileLoader from './loaders/JsonFileLoader'
import XmlFileLoader from './loaders/XmlFileLoader'
import ComponentScanLoader from './loaders/ComponentScanLoader'
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
  Scheduler,
  ConditionalOnMissingBean,
  ControllerAdvice,
  PostConstruct,
  PreDestroy
} from './decorators/Decorators'
import { ConfigurationOptions, RevaneConfiguration } from '../revane-configuration/RevaneConfiguration'
import { ContextPlugin } from '../revane-ioc-core/context/ContextPlugin'
import { ConfigurationPropertiesPostProcessor } from '../revane-configuration/ConfigurationPropertiesPostProcessor'
import { ConfigurationPropertiesPreProcessor } from '../revane-configuration/ConfigurationPropertiesPreProcessor'
import { ApplicationContext } from '../revane-ioc-core/ApplicationContext'
import { ConfigurationProperties } from '../revane-configuration/ConfigurationProperties'
import { JsonLoadingStrategy } from '../revane-configuration/loading/JsonLoadingStrategy'
import { Scheduled } from '../revane-scheduler/Scheduled'
import { SchedulerBeanPostProcessor } from '../revane-scheduler/SchedulerBeanPostProcessor'
import { TaskScheduler } from '../revane-scheduler/TaskScheduler'
import { join } from 'path'
import { ConfigurationLoader } from '../revane-configuration/ConfigurationLoader'
import BeanTypeRegistry from '../revane-ioc-core/context/bean/BeanTypeRegistry'
import { SchedulerLoader } from '../revane-scheduler/SchedulerLoader'
import { YmlLoadingStrategy } from '../revane-configuration/loading/YmlLoadingStrategy'
import { LogFactory } from '../revane-logging/LogFactory'
import { Logger } from 'apheleia'
import { LoggingOptions } from '../revane-logging/LoggingOptions'
import { LoggingLoader } from '../revane-logging/LoggingLoader'

import { BeanAnnotationBeanFactoryPreProcessor } from './BeanAnnotationBeanFactoryPreProcessor'
import { CoreOptionsBuilder } from './CoreOptionsBuilder'
import { PropertiesLoadingStrategy } from '../revane-configuration/loading/PropertiesLoadingStrategy'
import { LifeCycleBeanFactoryPreProcessor } from './LifeCycleBeanFactoryPreProcessor'

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
  ControllerAdvice,
  Scheduler,
  Scope,
  Bean,
  Configuration,
  ConfigurationProperties,
  ContextPlugin,
  ApplicationContext,
  Scheduled,
  ConditionalOnMissingBean,
  Logger,
  LogFactory,
  RevaneConfiguration,
  PostConstruct,
  PreDestroy
}

export default class RevaneIOC {
  private revaneCore: RevaneCore
  private options: Options
  private initialized: boolean = false
  private readonly configuration: RevaneConfiguration
  private readonly taskScheduler: TaskScheduler = new TaskScheduler()

  constructor (options: Options) {
    this.options = options
    if (this.options.plugins == null) {
      this.options.plugins = {}
    }
    if (this.options.plugins.loaders == null) {
      this.options.plugins.loaders = []
    }
    if (this.options.scheduling == null) {
      this.options.scheduling = { enabled: true }
    }
    if (!this.options.scheduling.enabled) {
      this.options.scheduling.enabled = false
    }
    if (this.options.noRedefinition == null) {
      this.options.noRedefinition = true
    }
    if (this.options.autoConfiguration == null) {
      this.options.autoConfiguration = false
    }

    this.options.profile = this.options.profile || process.env.REVANE_PROFILE

    this.configuration = new RevaneConfiguration(
      new ConfigurationOptions(
        this.options.profile,
        this.configPath(),
        this.options.configuration?.required || false,
        this.options.autoConfiguration || this.options.configuration.disabled,
        [
          new JsonLoadingStrategy(),
          new YmlLoadingStrategy(),
          new PropertiesLoadingStrategy()
        ],
        this.options.basePackage
      )
    )
  }

  private configPath (): string {
    if (this.options.configuration?.directory?.startsWith('/')) {
      return this.options.configuration.directory
    }
    return join(this.options.basePackage, this.options.configuration?.directory || '/config')
  }

  public async initialize (): Promise<void> {
    await this.configuration.init()
    this.loadOptionsFromConfiguration()
    const coreOptionsBuilder = new CoreOptionsBuilder(this.isLoggingEnabled())
    const coreOptions = coreOptionsBuilder.prepareCoreOptions(this.options)
    const beanTypeRegistry = this.beanTypeRegistry()
    this.revaneCore = new RevaneCore(coreOptions, beanTypeRegistry)
    await this.addDefaultPlugins()
    this.addPlugins()
    await this.revaneCore.initialize()
    this.initialized = true
  }

  private loadOptionsFromConfiguration (): void {
    if (this.configuration.has('revane.scheduling.enabled')) {
      const schedulerDisabled = this.configuration.getBoolean('revane.scheduling.enabled')
      this.options.scheduling.enabled = schedulerDisabled
    }
    if (this.configuration.has('revane.main.allow-bean-definition-overriding')) {
      const allowRedefinition = this.configuration.getBoolean('revane.main.allow-bean-definition-overriding')
      this.options.noRedefinition = !allowRedefinition
    }
  }

  private loggingOptions (): LoggingOptions {
    let rootLevel = 'INFO'
    if (this.configuration.has('revane.logging.rootLevel')) {
      rootLevel = this.configuration.getString('revane.logging.rootLevel')
    }
    let levels = {}
    if (this.configuration.has('revane.logging.level')) {
      levels = this.configuration.get('revane.logging.level')
    }
    let file = null
    if (this.configuration.has('revane.logging.file')) {
      file = this.configuration.getString('revane.logging.file')
    }
    let path = null
    if (this.configuration.has('revane.logging.path')) {
      path = this.configuration.getString('revane.logging.path')
    }
    return new LoggingOptions(
      rootLevel,
      levels,
      this.options.basePackage,
      file,
      path
    )
  }

  public async get (id: string): Promise<any> {
    this.checkIfInitialized()
    return await this.revaneCore.get(id)
  }

  public async has (id: string): Promise<boolean> {
    this.checkIfInitialized()
    return await this.revaneCore.has(id)
  }

  public async getMultiple (ids: string[]): Promise<any[]> {
    this.checkIfInitialized()
    return await this.revaneCore.getMultiple(ids)
  }

  public async getByType (type: string): Promise<any[]> {
    this.checkIfInitialized()
    return await this.revaneCore.getByType(type)
  }

  public async close (): Promise<void> {
    this.taskScheduler.close()
    await this.revaneCore.close()
  }

  public setParent (parent: RevaneIOC): void {
    this.revaneCore.setParent(parent.getContext())
  }

  public getContext (): ApplicationContext {
    return this.revaneCore.getContext()
  }

  private async addDefaultPlugins (): Promise<void> {
    if (!this.options.configuration?.disabled) {
      this.revaneCore.addPlugin('loader', new ConfigurationLoader(this.configuration))
    }
    this.revaneCore.addPlugin('loader', new SchedulerLoader(this.taskScheduler))
    this.revaneCore.addPlugin('loader', this.getLoader('xml') || new XmlFileLoader())
    this.revaneCore.addPlugin('loader', this.getLoader('json') || new JsonFileLoader())
    this.revaneCore.addPlugin('loader', this.getLoader('scan') || new ComponentScanLoader())
    this.revaneCore.addPlugin('beanFactoryPreProcessor', new BeanAnnotationBeanFactoryPreProcessor())
    this.revaneCore.addPlugin('beanFactoryPreProcessor', new LifeCycleBeanFactoryPreProcessor())
    if (!this.options.configuration?.disabled) {
      this.revaneCore.addPlugin(
        'beanFactoryPostProcessor',
        new ConfigurationPropertiesPostProcessor(this.configuration)
      )
      this.revaneCore.addPlugin('beanFactoryPreProcessor', new ConfigurationPropertiesPreProcessor())
    }
    this.revaneCore.addPlugin(
      'beanFactoryPostProcessor',
      new SchedulerBeanPostProcessor(this.taskScheduler, this.options.scheduling.enabled)
    )
    if (this.isLoggingEnabled()) {
      this.revaneCore.addPlugin('loader', new LoggingLoader(this.loggingOptions()))
    }
  }

  private isLoggingEnabled (): boolean {
    const loggingEnabled = this.configuration.has('revane.logging.enabled')
    return !loggingEnabled ||
    (loggingEnabled &&
      this.configuration.getBoolean('revane.logging.enabled'))
  }

  private addPlugins (): void {
    for (const loader of this.options.plugins.loaders) {
      if (!['xml', 'json', 'scan'].includes(loader.type())) {
        this.revaneCore.addPlugin('loader', loader)
      }
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

  private beanTypeRegistry (): BeanTypeRegistry {
    const beanTypeRegistry = new DefaultBeanTypeRegistry()
    beanTypeRegistry.register(SingletonBean)
    beanTypeRegistry.register(PrototypeBean)
    return beanTypeRegistry
  }

  private checkIfInitialized (): void {
    if (!this.initialized) {
      throw new NotInitializedError()
    }
  }
}
