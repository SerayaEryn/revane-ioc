import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import { BeanFactoryPreProcessor } from '../revane-ioc-core/preProcessors/BeanFactoryPreProcessor'
import { Loader, RevaneConfiguration } from './RevaneIOC'

export interface Extension {
  initialize: (configuration: RevaneConfiguration) => Promise<void>
  beanFactoryPreProcessors: () => BeanFactoryPreProcessor[]
  beanFactoryPostProcessors: () => BeanFactoryPostProcessor[]
  beanLoaders: () => Loader[]
  close: () => Promise<void>
}
