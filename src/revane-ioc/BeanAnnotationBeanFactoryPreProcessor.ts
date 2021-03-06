import { Reflect } from '../revane-utils/Reflect'
import { beansSym } from './decorators/Symbols'
import { BeanFactoryPreProcessor } from '../revane-ioc-core/preProcessors/BeanFactoryPreProcessor'
import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'
import { BeanAnnotationBeanDefinition } from './BeanAnnotationBeanDefinition'

export class BeanAnnotationBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  async preProcess (
    beanDefinition: BeanDefinition,
    beanDefinitions: BeanDefinition[]
  ): Promise<BeanDefinition[]> {
    const classConstructor = beanDefinition.classConstructor
    let beans = classConstructor.prototype ? Reflect.getMetadata(beansSym, classConstructor.prototype) || [] : []
    if (beanDefinition.instance?.constructor?.prototype != null) {
      beans = beans.concat(Reflect.getMetadata(beansSym, beanDefinition.instance.constructor.prototype) || [])
    }
    const createdBeans: BeanDefinition[] = [beanDefinition]
    for (const beanFactory of beans) {
      const beanDefinition2: BeanDefinition = new BeanAnnotationBeanDefinition(beanFactory.id, beanFactory.propertyKey)
      beanDefinition2.type = beanFactory.type
      beanDefinition2.scope = 'singleton'
      beanDefinition2.dependencyIds = [{ ref: beanDefinition.id }]
      createdBeans.push(beanDefinition2)
    }
    return createdBeans
  }
}
