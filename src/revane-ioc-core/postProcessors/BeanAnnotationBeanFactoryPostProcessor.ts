import { BeanFactoryPostProcessor } from './BeanFactoryPostProcessor'
import BeanDefinition from '../BeanDefinition'
import Bean from '../context/bean/Bean'
import SingletonBean from '../../revane-ioc/bean/SingletonBean'

export class BeanAnnotationBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
  async postProcess (beanDefinition: BeanDefinition, bean: Bean): Promise<Bean[]> {
    const classConstructor = beanDefinition.classConstructor
    const beans = classConstructor.prototype ? Reflect.getMetadata('beans', classConstructor.prototype) || [] : []
    const createdBeans: Bean[] = []
    for (const bean of beans) {
      const beanDefinition2: BeanDefinition = new BeanDefinition(bean.id)
      beanDefinition2.type = bean.type
      beanDefinition2.scope = 'singleton'
      beanDefinition2.instance = bean.instance
      const beanFromFactory = new SingletonBean(beanDefinition2)
      await beanFromFactory.init()
      createdBeans.push(beanFromFactory)
    }
    return createdBeans.concat([bean])
  }
}
