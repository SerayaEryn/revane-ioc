import { BeanDefinition } from '../BeanDefinition.js'

export interface BeanFactoryPreProcessor {
  preProcess: (
    beanDefinition: BeanDefinition,
    beanDefinitions: BeanDefinition[]
  ) => Promise<BeanDefinition[]>
}
