import { BeanFactoryPreProcessor } from '../revane-ioc-core/preProcessors/BeanFactoryPreProcessor'
import { Extension } from '../revane-ioc/Extension'
import { BeanAnnotationBeanFactoryPreProcessor } from './BeanAnnotationBeanFactoryPreProcessor'

export class BeanFactoryExtension extends Extension {
  public beanFactoryPreProcessors (): BeanFactoryPreProcessor[] {
    return [
      new BeanAnnotationBeanFactoryPreProcessor()
    ]
  }
}
