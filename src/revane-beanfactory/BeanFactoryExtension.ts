import { BeanFactoryPreProcessor } from '../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js'
import { Extension } from '../revane-ioc/Extension.js'
import { BeanAnnotationBeanFactoryPreProcessor } from './BeanAnnotationBeanFactoryPreProcessor.js'

export class BeanFactoryExtension extends Extension {
  public beanFactoryPreProcessors (): BeanFactoryPreProcessor[] {
    return [
      new BeanAnnotationBeanFactoryPreProcessor()
    ]
  }
}
