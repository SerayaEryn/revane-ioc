import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition'
import Bean from '../revane-ioc-core/context/bean/Bean'
import SingletonBean from './bean/SingletonBean'
import { Reflect } from '../revane-utils/Reflect'
import { beansSym } from './decorators/Symbols'

export class BeanAnnotationBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
  async postProcess (beanDefinition: DefaultBeanDefinition, bean: Bean): Promise<Bean[]> {
    const classConstructor = beanDefinition.classConstructor
    const beans = classConstructor.prototype ? Reflect.getMetadata(beansSym, classConstructor.prototype) || [] : []
    const createdBeans: Bean[] = []
    for (const bean of beans) {
      const beanDefinition2: DefaultBeanDefinition = new DefaultBeanDefinition(bean.id)
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
