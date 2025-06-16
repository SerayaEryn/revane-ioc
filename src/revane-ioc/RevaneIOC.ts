import { RegexFilter } from '../revane-ioc-core/Options'
import RevaneCore from '../revane-ioc-core/RevaneIOCCore'
import DefaultBeanTypeRegistry from '../revane-ioc-core/context/bean/DefaultBeanTypeRegistry'

import JsonFileLoader from './loaders/JsonFileLoader'
import XmlFileLoader from './loaders/XmlFileLoader'
import PrototypeBean from './bean/PrototypeBean'
import SingletonBean from './bean/SingletonBean'
import Options from './Options'
import NotInitializedError from './NotInitializedError'
import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition'
import Loader from '../revane-ioc-core/Loader'
import {
  ConditionalOnMissingBean,
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
import { LoaderOptions } from '../revane-ioc-core/LoaderOptions'
import { buildConfiguration } from './ConfigurationFactory'
import { CoreOptionsBuilder } from './CoreOptionsBuilder'
import { LifeCycleBeanFactoryPostProcessor } from './LifeCycleBeanFactoryPostProcessor'
import { Extension } from './Extension'
import { SchedulingExtension } from '../revane-scheduler/SchedulingExtension'
import { LoggingExtension } from '../revane-logging/LoggingExtension'
import { BeanFactoryExtension } from '../revane-beanfactory/BeanFactoryExtension'
import { Scopes } from '../revane-ioc-core/Scopes'
import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'
import { XmlFileLoaderOptions } from './loaders/XmlFileLoaderOptions'
import { JsonFileLoaderOptions } from './loaders/JsonFileLoaderOptions'
import 'reflect-metadata'
import {
  Component,
  ComponentScanExtension,
  ComponentScanLoaderOptions,
  Configuration,
  Controller,
  ControllerAdvice,
  Repository,
  Scheduler,
  Scope,
  Service
} from '../revane-componentscan/RevaneConponentScan'
import { DependencyResolver } from '../revane-ioc-core/dependencies/DependencyResolver'

export {
  BeanDefinition,
  DefaultBeanDefinition,
  Loader,
  XmlFileLoader,
  JsonFileLoader,
  RegexFilter,
  Options,
  LoaderOptions,
  ComponentScanLoaderOptions,
  XmlFileLoaderOptions,
  JsonFileLoaderOptions,
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
  Scopes,
  ComponentScanExtension,
  DependencyResolver
}

const ALLOW_BEAN_REDEFINITION = 'revane.main.allow-bean-definition-overriding'

export default class RevaneIOC {
  #revaneCore: RevaneCore
  #options: Options
  #initialized = false
  readonly #configuration: RevaneConfiguration

  constructor (options: Options) {
    this.#options = options
    if (this.#options.autoConfiguration == null) {
      this.#options.autoConfiguration = false
    }

    const profile = this.#options.profile ?? process.env.REVANE_PROFILE ?? 'dev'
    this.#options.profile = profile
    this.#configuration = buildConfiguration(this.#options, profile)
  }

  public async initialize (): Promise<void> {
    await this.#configuration.init()
    this.loadOptionsFromConfiguration()
    for (const extension of this.#options.extensions) {
      await extension.initialize(this.#configuration)
    }
    const coreOptionsBuilder = new CoreOptionsBuilder()
    const coreOptions = coreOptionsBuilder.prepareCoreOptions(this.#options)
    const beanTypeRegistry = this.beanTypeRegistry()
    this.#revaneCore = new RevaneCore(coreOptions, beanTypeRegistry)
    await this.addDefaultPlugins()
    await this.#revaneCore.initialize()
    this.#initialized = true
  }

  private loadOptionsFromConfiguration (): void {
    if (this.#configuration.has(ALLOW_BEAN_REDEFINITION)) {
      const allowRedefinition = this.#configuration.getBoolean(ALLOW_BEAN_REDEFINITION)
      this.#options.noRedefinition = !allowRedefinition
    }
  }

  public async get (id: string): Promise<any> {
    this.checkIfInitialized()
    return await this.#revaneCore.getById(id)
  }

  public async has (id: string): Promise<boolean> {
    this.checkIfInitialized()
    return await this.#revaneCore.hasById(id)
  }

  public async getMultiple (ids: string[]): Promise<any[]> {
    this.checkIfInitialized()
    return await this.#revaneCore.getMultipleById(ids)
  }

  public async getByType (type: string): Promise<any[]> {
    this.checkIfInitialized()
    return await this.#revaneCore.getByType(type)
  }

  public async close (): Promise<void> {
    for (const extension of this.#options.extensions) {
      await extension.close()
    }
    await this.#revaneCore.close()
  }

  public setParent (parent: RevaneIOC): void {
    this.#revaneCore.setParent(parent.getContext())
  }

  public getContext (): ApplicationContext {
    return this.#revaneCore.getContext()
  }

  private async addDefaultPlugins (): Promise<void> {
    if (!(this.#options.configuration?.disabled ?? false)) {
      this.#revaneCore.addPlugin('loader', new ConfigurationLoader(this.#configuration))
    }
    this.#revaneCore?.addPlugin('loader', new XmlFileLoader())
    this.#revaneCore?.addPlugin('loader', new JsonFileLoader())
    this.#revaneCore?.addPlugin('beanFactoryPostProcessor', new LifeCycleBeanFactoryPostProcessor())
    if (!(this.#options.configuration?.disabled ?? false)) {
      this.#revaneCore?.addPlugin(
        'beanFactoryPostProcessor',
        new ConfigurationPropertiesPostProcessor(this.#configuration)
      )
      this.#revaneCore?.addPlugin('beanFactoryPreProcessor', new ConfigurationPropertiesPreProcessor())
    }
    for (const extension of this.#options.extensions) {
      for (const beanFactoryPreProcessor of extension.beanFactoryPreProcessors()) {
        this.#revaneCore?.addPlugin('beanFactoryPreProcessor', beanFactoryPreProcessor)
      }
      for (const beanFactoryPostProcessor of extension.beanFactoryPostProcessors()) {
        this.#revaneCore?.addPlugin('beanFactoryPostProcessor', beanFactoryPostProcessor)
      }
      for (const loader of extension.beanLoaders()) {
        this.#revaneCore?.addPlugin('loader', loader)
      }
      for (const dependencyResolver of extension.dependencyResolvers()) {
        this.#revaneCore?.addPlugin('dependencyResolver', dependencyResolver)
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
    if (!this.#initialized) {
      throw new NotInitializedError()
    }
  }
}
