import BeanDefinition from '../BeanDefinition'
import Bean from '../context/bean/Bean'

export interface BeanFactoryPostProcessor {
  postProcess (beanDefinition: BeanDefinition, bean: Bean): Promise<Bean[]>
}
