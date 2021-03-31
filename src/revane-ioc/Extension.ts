import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import { Loader, RevaneConfiguration } from './RevaneIOC'

export interface Extension {
  initialize: (configuration: RevaneConfiguration) => Promise<void>
  beanFactoryPostProcessors: () => BeanFactoryPostProcessor[]
  beanLoaders: () => Loader[]
  close: () => Promise<void>
}
