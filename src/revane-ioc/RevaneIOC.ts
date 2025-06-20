import { RegexFilter } from "../revane-ioc-core/Options.js";
import RevaneCore from "../revane-ioc-core/RevaneIOCCore.js";
import DefaultBeanTypeRegistry from "../revane-ioc-core/context/bean/DefaultBeanTypeRegistry.js";

import JsonFileLoader from "./loaders/JsonFileLoader.js";
import XmlFileLoader from "./loaders/XmlFileLoader.js";
import PrototypeBean from "./bean/PrototypeBean.js";
import SingletonBean from "./bean/SingletonBean.js";
import Options from "./Options.js";
import NotInitializedError from "./NotInitializedError.js";
import DefaultBeanDefinition from "../revane-ioc-core/DefaultBeanDefinition.js";
import Loader from "../revane-ioc-core/Loader.js";
import {
  PostConstruct,
  PreDestroy,
} from "../revane-lifecycle/LifeCycleDecorators.js";
import { RevaneConfiguration } from "../revane-configuration/RevaneConfiguration.js";
import { ContextPlugin } from "../revane-ioc-core/context/ContextPlugin.js";
import { ApplicationContext } from "../revane-ioc-core/ApplicationContext.js";
import { ConfigurationProperties } from "../revane-configuration/ConfigurationProperties.js";
import { Scheduled } from "../revane-scheduler/Scheduled.js";
import BeanTypeRegistry from "../revane-ioc-core/context/bean/BeanTypeRegistry.js";
import { LogFactory } from "../revane-logging/LogFactory.js";
import { Logger } from "apheleia";

import { Bean } from "../revane-beanfactory/BeanDecorator.js";
import { LoaderOptions } from "../revane-ioc-core/LoaderOptions.js";
import { CoreOptionsBuilder } from "./CoreOptionsBuilder.js";
import { Extension } from "./Extension.js";
import { SchedulingExtension } from "../revane-scheduler/SchedulingExtension.js";
import { LoggingExtension } from "../revane-logging/LoggingExtension.js";
import { BeanFactoryExtension } from "../revane-beanfactory/BeanFactoryExtension.js";
import { Scopes } from "../revane-ioc-core/Scopes.js";
import { BeanDefinition } from "../revane-ioc-core/BeanDefinition.js";
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
  Scheduler,
  Scope,
  Service,
} from "../revane-componentscan/RevaneConponentScan.js";
import { DependencyResolver } from "../revane-ioc-core/dependencies/DependencyResolver.js";
import { ConfigurationExtension } from "../revane-configuration/ConfigurationExtension.js";
import { LifeCycleExtension } from "../revane-lifecycle/LifeCycleExtension.js";
import {
  ConditionalExtension,
  ConditionalOnFile,
  ConditionalOnMissingBean,
  ConditionalOnProperty,
} from "../revane-conditional/RevaneConditional.js";

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
  DependencyResolver,
  ConditionalOnFile,
  ConditionalOnProperty,
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
    return beanTypeRegistry;
  }

  private checkIfInitialized(): void {
    if (!this.#initialized) {
      throw new NotInitializedError();
    }
  }
}
