import { RegexFilter } from '../revane-ioc-core/Options'
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
  Scheduler,
  ConditionalOnMissingBean,
  ControllerAdvice,
  PostConstruct,
  PreDestroy
} from './decorators/Decorators'
import { RevaneConfiguration } from '../revane-configuration/RevaneConfiguration'
import { ContextPlugin } from '../revane-ioc-core/context/ContextPlugin'
import { ConfigurationPropertiesPostProcessor } from '../revane-configuration/ConfigurationPropertiesPostProcessor'
import { ConfigurationPropertiesPreProcessor } from '../revane-configuration/ConfigurationPropertiesPreProcessor'
import { ApplicationContext } from '../revane-ioc-core/ApplicationContext'
import { ConfigurationProperties } from '../revane-configuration/ConfigurationProperties'
import { Scheduled } from '../revane-scheduler/Scheduled'
import { ConfigurationLoader } from '../revane-configuration/ConfigurationLoader'
import BeanTypeRegistry from '../revane-ioc-core/context/bean/BeanTypeRegistry'
import { LogFactory } from '../revane-logging/LogFactory'
import { Logger } from 'apheleia'

import { Bean } from '../revane-beanfactory/BeanDecorator'
import { buildConfiguration } from './ConfigurationFactory'
import { CoreOptionsBuilder } from './CoreOptionsBuilder'
import { LifeCycleBeanFactoryPreProcessor } from './LifeCycleBeanFactoryPreProcessor'
import { Extension } from './Extension'
import { SchedulingExtension } from '../revane-scheduler/SchedulingExtension'
import { LoggingExtension } from '../revane-logging/LoggingExtension'
import { LoaderOptions } from '../revane-ioc-core/LoaderOptions'
import { BeanFactoryExtension } from '../revane-beanfactory/BeanFactoryExtension'
import { Scopes } from '../revane-ioc-core/Scopes'

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
  PreDestroy,
  Extension,
  SchedulingExtension,
  LoggingExtension,
  BeanFactoryExtension,
  Scopes
}

export default class RevaneIOC {
  private revaneCore: RevaneCore
  private options: Options
  private initialized: boolean = false
  private readonly configuration: RevaneConfiguration

  constructor (options: Options) {
    this.options = options
    if (this.options.autoConfiguration == null) {
      this.options.autoConfiguration = false
    }

    const profile = this.options.profile ?? process.env.REVANE_PROFILE ?? 'dev'
    this.options.profile = profile

    this.configuration = buildConfiguration(this.options, profile)
  }

  public async initialize (): Promise<void> {
    await this.configuration.init()
    this.loadOptionsFromConfiguration()
    for (const extension of this.options.extensions) {
      await extension.initialize(this.configuration)
    }
    const coreOptionsBuilder = new CoreOptionsBuilder()
    const coreOptions = coreOptionsBuilder.prepareCoreOptions(this.options)
    const beanTypeRegistry = this.beanTypeRegistry()
    this.revaneCore = new RevaneCore(coreOptions, beanTypeRegistry)
    await this.addDefaultPlugins()
    await this.revaneCore.initialize()
    this.initialized = true
  }

  private loadOptionsFromConfiguration (): void {
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
    for (const extension of this.options.extensions) {
      await extension.close()
    }
    await this.revaneCore.close()
  }

  public setParent (parent: RevaneIOC): void {
    this.revaneCore.setParent(parent.getContext())
  }

  public getContext (): ApplicationContext {
    return this.revaneCore.getContext()
  }

  private async addDefaultPlugins (): Promise<void> {
    if (!(this.options.configuration?.disabled ?? false)) {
      this.revaneCore.addPlugin('loader', new ConfigurationLoader(this.configuration))
    }
    this.revaneCore?.addPlugin('loader', new XmlFileLoader())
    this.revaneCore?.addPlugin('loader', new JsonFileLoader())
    this.revaneCore?.addPlugin('loader', new ComponentScanLoader())
    this.revaneCore?.addPlugin('beanFactoryPreProcessor', new LifeCycleBeanFactoryPreProcessor())
    if (!(this.options.configuration?.disabled ?? false)) {
      this.revaneCore?.addPlugin(
        'beanFactoryPostProcessor',
        new ConfigurationPropertiesPostProcessor(this.configuration)
      )
      this.revaneCore?.addPlugin('beanFactoryPreProcessor', new ConfigurationPropertiesPreProcessor())
    }
    for (const extension of this.options.extensions) {
      for (const beanFactoryPreProcessor of extension.beanFactoryPreProcessors()) {
        this.revaneCore?.addPlugin('beanFactoryPreProcessor', beanFactoryPreProcessor)
      }
      for (const beanFactoryPostProcessor of extension.beanFactoryPostProcessors()) {
        this.revaneCore?.addPlugin('beanFactoryPostProcessor', beanFactoryPostProcessor)
      }
      for (const loader of extension.beanLoaders()) {
        this.revaneCore?.addPlugin('loader', loader)
      }
    }
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
