import DefaultBeanDefinition from '../DefaultBeanDefinition.js'

export interface ContextPlugin {
  plugin: (beanDefinitions: DefaultBeanDefinition[]) => Promise<DefaultBeanDefinition[]>
}
