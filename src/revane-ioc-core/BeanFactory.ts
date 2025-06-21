import { BeanFactoryPostProcessor } from "./postProcessors/BeanFactoryPostProcessor.js";
import { DefaultApplicationContext } from "./DefaultApplicationContext.js";
import Bean from "./context/bean/Bean.js";
import DependencyRegisterError from "./context/errors/DependencyRegisterError.js";
import BeanTypeRegistry from "./context/bean/BeanTypeRegistry.js";
import DependencyNotFoundError from "./context/errors/DependencyNotFoundError.js";
import Options from "./Options.js";
import ConflictingBeanDefinitionError from "./context/errors/BeanDefinedTwiceError.js";
import { BeanFactoryPreProcessor } from "./preProcessors/BeanFactoryPreProcessor.js";
import { BeanDefinition } from "./BeanDefinition.js";
import { RethrowableError } from "./RethrowableError.js";
import { DependencyService } from "./dependencies/DependencyService.js";
import { DependencyDefinition } from "./dependencies/DependencyDefinition.js";
import CircularDependencyError from "./context/errors/CircularDependencyError.js";

export class BeanFactory {
  private readonly preProcessors: BeanFactoryPreProcessor[];
  private readonly postProcessors: BeanFactoryPostProcessor[];
  private readonly context: DefaultApplicationContext;
  private readonly beanTypeRegistry: BeanTypeRegistry;
  private readonly options: Options;

  constructor(
    preProcessors: BeanFactoryPreProcessor[],
    postProcessors: BeanFactoryPostProcessor[],
    context: DefaultApplicationContext,
    beanTypeRegistry: BeanTypeRegistry,
    options: Options,
    plugins: Map<string, any>,
    private readonly dependencyService: DependencyService,
  ) {
    this.preProcessors = preProcessors;
    this.postProcessors = postProcessors;
    this.context = context;
    this.beanTypeRegistry = beanTypeRegistry;
    this.options = options;
    this.registerDependency = this.registerDependency.bind(this);
  }

  async process(beanDefinitions: BeanDefinition[]): Promise<void> {
    let preprocessed = [...beanDefinitions];
    for (const beanDefinition of beanDefinitions) {
      for (const preProcessor of this.preProcessors) {
        const preProcessedBeanDefinitions = await preProcessor.preProcess(
          beanDefinition,
          preprocessed,
        );
        const index = preprocessed.indexOf(beanDefinition);
        preprocessed.splice(index, 1);
        if (preProcessedBeanDefinitions.length == 0) {
          break;
        }
        preprocessed = preprocessed.concat(preProcessedBeanDefinitions);
      }
    }
    const processedBeanDefinitions = new Map<string, BeanDefinition>();
    for (const preProcessedBeanDefinition of preprocessed) {
      const exitingBeanDefininaton = processedBeanDefinitions.get(
        preProcessedBeanDefinition.id,
      );
      if (
        exitingBeanDefininaton != null &&
        this.options.noRedefinition !== false
      ) {
        throw new ConflictingBeanDefinitionError(exitingBeanDefininaton.id);
      }
      processedBeanDefinitions.set(
        preProcessedBeanDefinition.id,
        preProcessedBeanDefinition,
      );
      if (!(await this.context.hasById(preProcessedBeanDefinition.id))) {
        const bean = await this.registerBean(
          preProcessedBeanDefinition,
          preprocessed,
        );
        this.context.put([bean]);
      }
    }
  }

  private async registerBean(
    entry: BeanDefinition,
    beanDefinitions: BeanDefinition[],
  ): Promise<Bean> {
    try {
      const bean = await this.createBean(entry, beanDefinitions);
      await bean.init();
      await bean.postConstruct();
      return bean;
    } catch (error) {
      if (error instanceof RethrowableError && error.isRethrowable) {
        throw error;
      }
      throw new DependencyRegisterError(entry.id, error);
    }
  }

  private async createBean(
    entry: BeanDefinition,
    beanDefinitions: BeanDefinition[],
  ): Promise<Bean> {
    const dependencies = await this.getDependencies(entry, beanDefinitions);
    return await entry.create(
      dependencies,
      this.beanTypeRegistry,
      async (bean: Bean, beanDefinition: BeanDefinition, instance: any) => {
        await this.postProcess(bean, beanDefinition, instance);
      },
    );
  }

  private async getDependencies(
    beanDefinition: BeanDefinition,
    beanDefinitions: BeanDefinition[],
  ): Promise<Bean[]> {
    if (!beanDefinition.isClass()) {
      return [];
    }
    const dependencies: Bean[] = [];
    for (const dependency of beanDefinition.dependencyIds) {
      if (beanDefinition.id == dependency.value) {
        throw new CircularDependencyError(beanDefinition.id);
      }
      const dependencyForBean = await this.dependencyService.getDependency(
        dependency,
        beanDefinition.id,
        beanDefinitions,
        this.registerDependency,
      );
      dependencies.push(dependencyForBean);
    }
    return dependencies;
  }

  private async registerDependency(
    dependency: DependencyDefinition,
    parentId: string,
    beanDefinitions: BeanDefinition[],
  ): Promise<void> {
    try {
      await this.findAndRegisterBean(dependency, parentId, beanDefinitions);
    } catch (err) {
      this.throwDependencyError(err, dependency.value);
    }
  }

  private async findAndRegisterBean(
    dependency: DependencyDefinition,
    parentId: string,
    beanDefinitions: BeanDefinition[],
  ): Promise<void> {
    const beanDefinition = this.findEntry(
      dependency,
      parentId,
      beanDefinitions,
    );
    const bean = await this.registerBean(beanDefinition, beanDefinitions);
    this.context.put([bean]);
  }

  private async postProcess(
    bean: Bean,
    beanDefinition: BeanDefinition,
    instance: any,
  ): Promise<Bean[]> {
    for (const postProcessor of this.postProcessors) {
      await postProcessor.postProcess(beanDefinition, bean, instance);
    }
    return [bean];
  }

  private findEntry(
    dependency: DependencyDefinition,
    parentId: string,
    beanDefinitions: BeanDefinition[],
  ): BeanDefinition {
    for (const entry of beanDefinitions) {
      if (
        entry.id === dependency.value ||
        entry.classConstructor === dependency.classType
      ) {
        return entry;
      }
    }
    throw new DependencyNotFoundError(dependency.value, parentId);
  }

  private throwDependencyError(
    err: Error | RethrowableError,
    id: string,
  ): void {
    if (err instanceof RethrowableError && err.isRethrowable) {
      throw err;
    }
    throw new DependencyRegisterError(id, err);
  }
}
