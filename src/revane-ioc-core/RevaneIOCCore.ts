import BeanLoader from "./BeanLoader.js";
import Options, { RegexFilter } from "./Options.js";
import Loader from "./Loader.js";

import BeanTypeRegistry from "./context/bean/BeanTypeRegistry.js";
import { ContextPlugin } from "./context/ContextPlugin.js";
import { DefaultApplicationContext } from "./DefaultApplicationContext.js";
import { BeanFactory } from "./BeanFactory.js";
import { ModuleLoaderBeanFactoryPreProcessor } from "./preProcessors/ModuleLoaderFactoryPreProcessor.js";
import { ApplicationContext } from "./ApplicationContext.js";
import { PathBeanFactoryPreProcessor } from "./preProcessors/PathBeanFactoryPreProcessor.js";
import { ScopeBeanFactoryPreProcessor } from "./preProcessors/ScopeBeanFactoryPreProcessor.js";
import { BeanFactoryPostProcessor } from "./postProcessors/BeanFactoryPostProcessor.js";
import { BeanFactoryPreProcessor } from "./preProcessors/BeanFactoryPreProcessor.js";
import { DependencyService } from "./dependencies/DependencyService.js";
import { BeanDependencyResolver } from "./dependencies/BeanDependencyResolver.js";
import { ValueDependencyResolver } from "./dependencies/ValueDependencyResolver.js";
import { DependencyResolver } from "./dependencies/DependencyResolver.js";
import { BeanDefinition } from "./BeanDefinition.js";
import { Scopes } from "./Scopes.js";
import { LoaderOptions } from "./LoaderOptions.js";
import DefaultBeanDefinition from "./DefaultBeanDefinition.js";
import DefaultBeanTypeRegistry from "./context/bean/DefaultBeanTypeRegistry.js";
import { REV_ERR_DEFINED_TWICE } from "./context/errors/BeanDefinedTwiceError.js";
import { REV_ERR_CIRCULAR_DEPENDENCY } from "./context/errors/CircularDependencyError.js";
import { REV_ERR_DEPENDENCY_NOT_FOUND } from "./context/errors/DependencyNotFoundError.js";
import { REV_ERR_DEPENDENCY_REGISTER } from "./context/errors/DependencyRegisterError.js";
import { REV_ERR_INVALID_SCOPE } from "./context/errors/InvalidScopeError.js";
import { REV_ERR_NOT_FOUND } from "./context/errors/NotFoundError.js";
import { REV_ERR_UNKNOWN_DEPENDENCY_TYPE } from "./dependencies/UnknownDependencyType.js";
import { SINGLETON_VALUE } from "./Scopes.js";

export {
  BeanDefinition,
  Scopes,
  LoaderOptions,
  BeanTypeRegistry,
  DefaultBeanDefinition,
  ContextPlugin,
  DefaultBeanTypeRegistry,
  ApplicationContext,
  RegexFilter,
  BeanFactoryPostProcessor,
  REV_ERR_DEFINED_TWICE,
  REV_ERR_CIRCULAR_DEPENDENCY,
  REV_ERR_DEPENDENCY_NOT_FOUND,
  REV_ERR_DEPENDENCY_REGISTER,
  REV_ERR_INVALID_SCOPE,
  REV_ERR_NOT_FOUND,
  REV_ERR_UNKNOWN_DEPENDENCY_TYPE,
  SINGLETON_VALUE,
};

export default class RevaneIOCCore {
  protected options: Options;
  private readonly context: ApplicationContext =
    new DefaultApplicationContext();
  private readonly beanTypeRegistry: BeanTypeRegistry;
  private readonly plugins = new Map<
    string,
    (
      | Loader
      | ContextPlugin
      | BeanFactoryPostProcessor
      | BeanFactoryPreProcessor
      | DependencyResolver
    )[]
  >();

  constructor(options: Options, beanTypeRegistry: BeanTypeRegistry) {
    this.options = options;
    this.beanTypeRegistry = beanTypeRegistry;
  }

  public addPlugin(
    name: string,
    plugin:
      | Loader
      | ContextPlugin
      | BeanFactoryPostProcessor
      | BeanFactoryPreProcessor
      | DependencyResolver,
  ): void {
    let pluginsByName = this.plugins.get(name);
    if (pluginsByName == null) {
      pluginsByName = [];
    }
    pluginsByName.push(plugin);
    this.plugins.set(name, pluginsByName);
  }

  public async initialize(): Promise<void> {
    const beanFactory = new BeanFactory(
      [
        new ScopeBeanFactoryPreProcessor(this.options),
        new PathBeanFactoryPreProcessor(this.options),
        new ModuleLoaderBeanFactoryPreProcessor(),
        ...((this.plugins.get(
          "beanFactoryPreProcessor",
        ) as BeanFactoryPreProcessor[]) ?? []),
      ],
      [
        ...((this.plugins.get(
          "beanFactoryPostProcessor",
        ) as BeanFactoryPostProcessor[]) ?? []),
      ],
      this.context as DefaultApplicationContext,
      this.beanTypeRegistry,
      this.options,
      new DependencyService(
        (
          [
            new BeanDependencyResolver(
              this.context as DefaultApplicationContext,
            ),
            new ValueDependencyResolver(),
          ] as DependencyResolver[]
        ).concat(
          (this.plugins.get("dependencyResolver") as DependencyResolver[]) ??
            [],
        ),
      ),
    );
    const loaders: Loader[] = (this.plugins.get("loader") as Loader[]) ?? [];
    const beanLoader = new BeanLoader(loaders);
    const beanDefinitions: any = await beanLoader.getBeanDefinitions(
      this.options,
    );
    await beanFactory.process(beanDefinitions.flat());
  }

  public async getById(id: string): Promise<any> {
    return await this.context.getById(id);
  }

  public async hasById(id: string): Promise<boolean> {
    return await this.context.hasById(id);
  }

  public async getMultipleById(ids: string[]): Promise<any[]> {
    const beans: any[] = [];
    for (const id of ids) {
      const bean = await this.getById(id);
      beans.push(bean);
    }
    return beans;
  }

  public async getByType(type: string): Promise<any[]> {
    return await this.context.getByType(type);
  }

  public async close(): Promise<void> {
    await this.context.close();
  }

  public getContext(): ApplicationContext {
    return this.context;
  }

  public setParent(context: ApplicationContext): void {
    this.context.setParent(context);
  }
}
