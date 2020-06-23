import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition'
import Bean from '../revane-ioc-core/context/bean/Bean'
import SingletonBean from './bean/SingletonBean'
import { Reflect } from '../revane-utils/Reflect'
import { beansSym } from './decorators/Symbols'

export class BeanAnnotationBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
  async postProcess (beanDefinition: DefaultBeanDefinition, bean: Bean): Promise<Bean[]> {
    const classConstructor = beanDefinition.classConstructor
    let beans = classConstructor.prototype ? Reflect.getMetadata(beansSym, classConstructor.prototype) || [] : []
    if (beanDefinition.instance?.constructor?.prototype != null) {
      beans = beans.concat(Reflect.getMetadata(beansSym, beanDefinition.instance.constructor.prototype) || [])
    }
    const createdBeans: Bean[] = []
    for (const beanFactory of beans) {
      const beanDefinition2: DefaultBeanDefinition = new DefaultBeanDefinition(beanFactory.id)
      beanDefinition2.type = beanFactory.type
      beanDefinition2.scope = 'singleton'
      beanDefinition2.instance = (await bean.getInstance())[beanFactory.propertyKey]()
      const beanFromFactory = new SingletonBean(beanDefinition2)
      await beanFromFactory.init()
      createdBeans.push(beanFromFactory)
    }
    return createdBeans.concat([bean])
  }
}
