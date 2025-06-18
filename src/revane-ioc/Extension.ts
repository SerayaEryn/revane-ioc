import { DependencyResolver } from "../revane-ioc-core/dependencies/DependencyResolver.js";
import { BeanFactoryPostProcessor } from "../revane-ioc-core/postProcessors/BeanFactoryPostProcessor.js";
import { BeanFactoryPreProcessor } from "../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js";
import { Loader, RevaneConfiguration } from "./RevaneIOC.js";

export abstract class Extension {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async initialize(configuration: RevaneConfiguration): Promise<void> {}

  public beanFactoryPreProcessors(): BeanFactoryPreProcessor[] {
    return [];
  }

  public beanFactoryPostProcessors(): BeanFactoryPostProcessor[] {
    return [];
  }

  public beanLoaders(): Loader[] {
    return [];
  }

  public async close(): Promise<void> {}

  public dependencyResolvers(): DependencyResolver[] {
    return [];
  }
}
