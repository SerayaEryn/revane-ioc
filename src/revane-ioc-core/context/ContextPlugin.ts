import BeanDefinition from '../BeanDefinition'

export interface ContextPlugin {
  plugin (beanDefinitions: BeanDefinition[]): Promise<BeanDefinition[]>
}
