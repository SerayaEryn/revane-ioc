import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'
import Bean from '../revane-ioc-core/context/bean/Bean'
import { Reflect } from '../revane-utils/Reflect'
import { eventListenerSym } from './Symbols'
import { EventListenerData } from './EventListenerData'
import { EventHandler } from './EventHandler'

export class EventListenerBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
  private readonly eventHandler: EventHandler

  constructor (eventHandler: EventHandler) {
    this.eventHandler = eventHandler
  }

  async postProcess (
    beanDefinition: BeanDefinition,
    bean: Bean
  ): Promise<Bean[]> {
    const eventListenerData = this.getEventListenerData(beanDefinition)
    if (eventListenerData != null) {
      this.registerEventListener(bean, eventListenerData)
    }
    return [bean]
  }

  private getEventListenerData (
    beanDefinition: BeanDefinition
  ): EventListenerData {
    const prototype = this.getPrototype(beanDefinition)
    if (prototype == null) {
      return null
    }
    return Reflect.getMetadata(eventListenerSym, prototype)
  }

  private getPrototype (beanDefinition: BeanDefinition): any {
    const classConstructor = beanDefinition.classConstructor
    const instance = beanDefinition.instance
    return this.getPrototypeFromInstanceOrClass(classConstructor, instance)
  }

  private getPrototypeFromInstanceOrClass (
    classConstructor: any,
    instance: any
  ): any {
    if (classConstructor.prototype != null) {
      return classConstructor.prototype
    } else if (instance?.constructor?.prototype != null) {
      return instance.constructor.prototype
    }
    return null
  }

  private registerEventListener (
    bean: Bean,
    eventListenerData: EventListenerData
  ): void {
    const instance = bean.getInstance()
    const methodName = eventListenerData.getMethodName()
    const eventListener = instance[methodName].bind(instance)
    this.eventHandler.registerEventListener(methodName, eventListener)
  }
}
