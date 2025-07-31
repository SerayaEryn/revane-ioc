import RevaneCore, {
  ApplicationContext,
  BeanDefinition,
  BeanTypeRegistry,
  ContextPlugin,
  DefaultBeanDefinition,
  DefaultBeanTypeRegistry,
  LoaderOptions,
  RegexFilter,
  REV_ERR_CIRCULAR_DEPENDENCY,
  REV_ERR_DEFINED_TWICE,
  REV_ERR_DEPENDENCY_NOT_FOUND,
  REV_ERR_DEPENDENCY_REGISTER,
  REV_ERR_INVALID_SCOPE,
  REV_ERR_NOT_FOUND,
  REV_ERR_UNKNOWN_DEPENDENCY_TYPE,
  Scopes,
  SINGLETON_VALUE,
  BeanFactoryPostProcessor,
} from "../revane-ioc-core/RevaneIOCCore.js";

import JsonFileLoader from "./loaders/JsonFileLoader.js";
import XmlFileLoader from "./loaders/XmlFileLoader.js";
import PrototypeBean from "./bean/PrototypeBean.js";
import SingletonBean from "./bean/SingletonBean.js";
import Options from "./Options.js";
import NotInitializedError, {
  REV_ERR_NOT_INITIALIZED,
} from "./NotInitializedError.js";
import Loader from "../revane-ioc-core/Loader.js";
import {
  ConfigurationExtension,
  ConfigurationProperties,
  REV_ERR_CONFIG_FILE_NOT_FOUND,
  REV_ERR_KEY_MISSING,
  REV_ERR_KEY_NOT_PRESENT_IN_CONFIG,
  REV_ERR_KEY_TYPE_MISMATCH,
  REV_ERR_NO_CONFIG_FILES_FOUND,
  RevaneConfiguration,
  Value,
} from "../revane-configuration/RevaneConfiguration.js";
import { Bean } from "../revane-beanfactory/BeanDecorator.js";
import { CoreOptionsBuilder } from "./CoreOptionsBuilder.js";
import { Extension } from "./Extension.js";
import { BeanFactoryExtension } from "../revane-beanfactory/BeanFactoryExtension.js";
import { XmlFileLoaderOptions } from "./loaders/XmlFileLoaderOptions.js";
import { JsonFileLoaderOptions } from "./loaders/JsonFileLoaderOptions.js";
import "reflect-metadata";
import {
  Component,
  ComponentScanExtension,
  ComponentScanLoaderOptions,
  Configuration,
  Controller,
  ControllerAdvice,
  Repository,
  REV_ERR_MODULE_LOAD_ERROR,
  Scheduler,
  Scope,
  Service,
  Type,
} from "../revane-componentscan/RevaneConponentScan.js";
import { DependencyResolver } from "../revane-ioc-core/dependencies/DependencyResolver.js";
import {
  Condition,
  Conditional,
  ConditionalExtension,
  ConditionalOnResource,
  ConditionalOnMissingBean,
  ConditionalOnProperty,
} from "../revane-conditional/RevaneConditional.js";
import {
  LogFactory,
  Logger,
  LoggingExtension,
} from "../revane-logging/RevaneLogging.js";
import {
  LifeCycleExtension,
  PostConstruct,
  PreDestroy,
} from "../revane-lifecycle/RevaneLifeCycle.js";
import {
  REV_ERR_INVALID_CRON_PATTERN_PROVIDED,
  REV_ERR_NO_CRON_PATTERN_PROVIDED,
  Scheduled,
  SchedulingExtension,
} from "../revane-scheduler/RevaneScheduler.js";
import { REV_ERR_UNKNOWN_ENDING } from "./UnknownEndingError.js";
import { BeanOptions } from "../revane-beanfactory/RevaneBeanFactory.js";
import AliasBean from "./bean/AliasBean.js";
import {
  CachingExtension,
  CacheManager,
  Cache,
  ValueWrapper,
  Cacheable,
  CacheEvict,
  SimpleCache,
} from "../revane-caching/RevaneCaching.js";

const errorCodes = {
  REV_ERR_MODULE_LOAD_ERROR,
  REV_ERR_KEY_NOT_PRESENT_IN_CONFIG,
  REV_ERR_NO_CONFIG_FILES_FOUND,
  REV_ERR_CONFIG_FILE_NOT_FOUND,
  REV_ERR_KEY_TYPE_MISMATCH,
  REV_ERR_NOT_INITIALIZED,
  REV_ERR_UNKNOWN_ENDING,
  REV_ERR_DEFINED_TWICE,
  REV_ERR_CIRCULAR_DEPENDENCY,
  REV_ERR_DEPENDENCY_NOT_FOUND,
  REV_ERR_DEPENDENCY_REGISTER,
  REV_ERR_INVALID_SCOPE,
  REV_ERR_NOT_FOUND,
  REV_ERR_UNKNOWN_DEPENDENCY_TYPE,
  REV_ERR_INVALID_CRON_PATTERN_PROVIDED,
  REV_ERR_NO_CRON_PATTERN_PROVIDED,
  REV_ERR_KEY_MISSING,
};

export { BeanOptions };

export {
  Loader,
  XmlFileLoader,
  JsonFileLoader,
  Options,
  ComponentScanLoaderOptions,
  XmlFileLoaderOptions,
  JsonFileLoaderOptions,
  Bean,
  Extension,
  BeanFactoryExtension,
  ComponentScanExtension,
  DependencyResolver,
  errorCodes,
};

export {
  Repository,
  Service,
  Component,
  Controller,
  ControllerAdvice,
  Scope,
  Scheduler,
  Type,
};

export {
  BeanDefinition,
  LoaderOptions,
  Scopes,
  DefaultBeanDefinition,
  ContextPlugin,
  RegexFilter,
  ApplicationContext,
  SINGLETON_VALUE,
  BeanFactoryPostProcessor,
};

export { Scheduled, SchedulingExtension };

export { PostConstruct, PreDestroy };

export { RevaneConfiguration, Configuration, ConfigurationProperties, Value };

export { LoggingExtension, Logger, LogFactory };

export {
  ConditionalOnMissingBean,
  ConditionalOnResource,
  ConditionalOnProperty,
  Condition,
  Conditional,
};

export {
  CacheManager,
  Cache,
  ValueWrapper,
  Cacheable,
  CacheEvict,
  SimpleCache,
};

export default class RevaneIOC {
  #revaneCore: RevaneCore;
  #options: Options;
  #initialized = false;
  readonly #configuration: RevaneConfiguration;

  constructor(options: Options) {
    this.#options = options;
    if (this.#options.autoConfiguration == null) {
      this.#options.autoConfiguration = false;
    }

    const profile = this.#options.profile ?? process.env.REVANE_PROFILE ?? null;
    this.#options.profile = profile;
    const configurationExtension = new ConfigurationExtension(
      this.#options,
      profile,
    );
    this.#configuration = configurationExtension.get();
    this.#options.extensions = [
      configurationExtension,
      new LifeCycleExtension(),
      new ConditionalExtension(this.#configuration),
      new CachingExtension(),
      ...this.#options.extensions,
    ];
  }

  public async initialize(): Promise<void> {
    for (const extension of this.#options.extensions) {
      await extension.initialize(this.#configuration);
    }
    const coreOptionsBuilder = new CoreOptionsBuilder();
    const coreOptions = coreOptionsBuilder.prepareCoreOptions(
      this.#options,
      this.#configuration,
    );
    const beanTypeRegistry = this.beanTypeRegistry();
    this.#revaneCore = new RevaneCore(coreOptions, beanTypeRegistry);
    await this.addDefaultPlugins();
    await this.#revaneCore.initialize();
    this.#initialized = true;
  }

  public async get(id: string): Promise<any> {
    this.checkIfInitialized();
    return await this.#revaneCore.getById(id);
  }

  public async has(id: string): Promise<boolean> {
    this.checkIfInitialized();
    return await this.#revaneCore.hasById(id);
  }

  public async getMultiple(ids: string[]): Promise<any[]> {
    this.checkIfInitialized();
    return await this.#revaneCore.getMultipleById(ids);
  }

  public async getByType(type: string): Promise<any[]> {
    this.checkIfInitialized();
    return await this.#revaneCore.getByType(type);
  }

  public async close(): Promise<void> {
    for (const extension of this.#options.extensions) {
      await extension.close();
    }
    await this.#revaneCore.close();
  }

  public setParent(parent: RevaneIOC): void {
    this.#revaneCore.setParent(parent.getContext());
  }

  public getContext(): ApplicationContext {
    return this.#revaneCore.getContext();
  }

  private async addDefaultPlugins(): Promise<void> {
    this.#revaneCore?.addPlugin("loader", new XmlFileLoader());
    this.#revaneCore?.addPlugin("loader", new JsonFileLoader());
    for (const extension of this.#options.extensions) {
      for (const beanFactoryPreProcessor of extension.beanFactoryPreProcessors()) {
        this.#revaneCore?.addPlugin(
          "beanFactoryPreProcessor",
          beanFactoryPreProcessor,
        );
      }
      for (const beanFactoryPostProcessor of extension.beanFactoryPostProcessors()) {
        this.#revaneCore?.addPlugin(
          "beanFactoryPostProcessor",
          beanFactoryPostProcessor,
        );
      }
      for (const loader of extension.beanLoaders()) {
        this.#revaneCore?.addPlugin("loader", loader);
      }
      for (const dependencyResolver of extension.dependencyResolvers()) {
        this.#revaneCore?.addPlugin("dependencyResolver", dependencyResolver);
      }
    }
  }

  private beanTypeRegistry(): BeanTypeRegistry {
    const beanTypeRegistry = new DefaultBeanTypeRegistry();
    beanTypeRegistry.register(SingletonBean);
    beanTypeRegistry.register(PrototypeBean);
    beanTypeRegistry.register(AliasBean);
    return beanTypeRegistry;
  }

  private checkIfInitialized(): void {
    if (!this.#initialized) {
      throw new NotInitializedError();
    }
  }
}
