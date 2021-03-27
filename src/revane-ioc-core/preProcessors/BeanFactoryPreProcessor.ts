import { BeanDefinition } from '../BeanDefinition'

export interface BeanFactoryPreProcessor {
  preProcess: (
    beanDefinition: BeanDefinition,
    beanDefinitions: BeanDefinition[]
  ) => Promise<BeanDefinition[]>
}
