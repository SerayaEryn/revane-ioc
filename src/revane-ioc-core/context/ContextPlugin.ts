import BeanDefinition from '../BeanDefinition'
import { BeanProvider } from './BeanProvider'

export interface ContextPlugin {
  plugin (
    beanDefinitions: Map<string, BeanDefinition>,
    beanProvider: BeanProvider
  ): Promise<Map<string, BeanDefinition>>
}
