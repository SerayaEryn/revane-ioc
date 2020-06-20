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
  Scheduler,
  ConditionalOnMissingBean
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
  Scheduled,
  ConditionalOnMissingBean
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

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    this.options.profile = this.options.profile || process.env.REVANE_PROFILE

    this.configuration = new RevaneConfiguration(
      new ConfigurationOptions(
        this.options.profile,
        this.configPath(),
        this.options.configuration?.required || false,
        this.options.autoConfiguration || this.options.configuration.disabled,
        [
          new JsonLoadingStrategy(),
          new YmlLoadingStrategy()
        ]
      )
    )
  }

  private configPath (): string {
    if (this.options.configuration?.directory?.startsWith('/')) {
      return this.options.configuration.directory
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return join(this.options.basePackage, this.options.configuration?.directory || '/config')
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
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    this.revaneCore.addPlugin('loader', this.getLoader('xml') || new XmlFileLoader())
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    this.revaneCore.addPlugin('loader', this.getLoader('json') || new JsonFileLoader())
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    this.revaneCore.addPlugin('loader', this.getLoader('scan') || new ComponentScanLoader())
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

  private prepareCoreOptions (options: Options): CoreOptions {
    const coreOptions: CoreOptions = new CoreOptions()
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    coreOptions.loaderOptions = options.loaderOptions || []
    this.checkForUnknownEndings(coreOptions.loaderOptions)

    if (!this.options.configuration?.disabled) {
      coreOptions.loaderOptions.push({ file: 'config' })
    }
    coreOptions.loaderOptions.push({ file: 'taskScheduler' })
    if (this.options.autoConfiguration) {
      coreOptions.loaderOptions.push({
        componentScan: true,
        basePackage: this.options.basePackage
      })
    }
    coreOptions.defaultScope = 'singleton'
    coreOptions.basePackage = options.basePackage
    coreOptions.noRedefinition = options.noRedefinition
    return coreOptions
  }

  private checkForUnknownEndings (files: LoaderOptions[]): void {
    const loaders = [
      new XmlFileLoader(), new JsonFileLoader(), new ComponentScanLoader()
    ].concat(this.options.plugins.loaders)
    for (const file of files) {
      const relevant: boolean[] = []
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
