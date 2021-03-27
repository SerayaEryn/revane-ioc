import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import { Loader, LoaderOptions, RevaneConfiguration } from './RevaneIOC'

export interface Extension {
  loaderOptions: () => LoaderOptions[]
  initialize: (configuration: RevaneConfiguration) => Promise<void>
  beanFactoryPostProcessors: () => BeanFactoryPostProcessor[]
  beanLoaders: () => Loader[]
  close: () => Promise<void>
}
