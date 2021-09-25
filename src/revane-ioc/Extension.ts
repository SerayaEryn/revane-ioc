import { DependencyResolver } from '../revane-ioc-core/dependencies/DependecyResolver'
import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import { BeanFactoryPreProcessor } from '../revane-ioc-core/preProcessors/BeanFactoryPreProcessor'
import { Loader, RevaneConfiguration } from './RevaneIOC'

export abstract class Extension {
  public async initialize (configuration: RevaneConfiguration): Promise<void> {}

  public beanFactoryPreProcessors (): BeanFactoryPreProcessor[] {
    return []
  }

  public beanFactoryPostProcessors (): BeanFactoryPostProcessor[] {
    return []
  }

  public beanLoaders (): Loader[] {
    return []
  }

  public async close (): Promise<void> {}

  public dependencyResolvers (): DependencyResolver[] {
    return []
  }
}
