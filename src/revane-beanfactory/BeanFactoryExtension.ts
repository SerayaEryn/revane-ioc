import { RevaneConfiguration } from '../revane-configuration/RevaneConfiguration'
import Loader from '../revane-ioc-core/Loader'
import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import { BeanFactoryPreProcessor } from '../revane-ioc-core/preProcessors/BeanFactoryPreProcessor'
import { Extension } from '../revane-ioc/Extension'
import { BeanAnnotationBeanFactoryPreProcessor } from './BeanAnnotationBeanFactoryPreProcessor'

export class BeanFactoryExtension implements Extension {
  public async initialize (configuration: RevaneConfiguration): Promise<void> {}

  public beanFactoryPreProcessors (): BeanFactoryPreProcessor[] {
    return [
      new BeanAnnotationBeanFactoryPreProcessor()
    ]
  }

  public beanFactoryPostProcessors (): BeanFactoryPostProcessor[] {
    return []
  }

  public beanLoaders (): Loader[] {
    return []
  }

  public async close (): Promise<void> {}
}
