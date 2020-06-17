import DefaultBeanDefinition from '../DefaultBeanDefinition'

export interface ContextPlugin {
  plugin (beanDefinitions: DefaultBeanDefinition[]): Promise<DefaultBeanDefinition[]>
}
