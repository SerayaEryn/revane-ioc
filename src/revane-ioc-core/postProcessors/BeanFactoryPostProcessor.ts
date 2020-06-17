import Bean from '../context/bean/Bean'
import { BeanDefinition } from '../BeanDefinition'

export interface BeanFactoryPostProcessor {
  postProcess (beanDefinition: BeanDefinition, bean: Bean): Promise<Bean[]>
}
