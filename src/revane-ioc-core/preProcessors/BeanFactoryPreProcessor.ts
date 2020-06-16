import BeanDefinition from '../BeanDefinition'

export interface BeanFactoryPreProcessor {
  preProcess (beanDefinition: BeanDefinition): Promise<BeanDefinition[]>
}
