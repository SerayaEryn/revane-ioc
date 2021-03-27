import { EventPublisher } from './EventPublisher'
import { ApplicationEvent } from './ApplicationEvent'
import { EventListener } from './EventListener'
import { EventListenerBeanFactoryPostProcessor } from './EventListenerBeanFactoryPostProcessor'
import { EventHandler } from './EventHandler'
import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import { DefaultEventPublisher } from './DefaultEventPublisher'

export {
  ApplicationEvent,
  EventPublisher as ApplicationEventPublisher,
  EventListener,
  EventListenerBeanFactoryPostProcessor
}

export class RevaneEvents {
  private readonly beanFactoryPostProcessor: EventListenerBeanFactoryPostProcessor
  private readonly eventPublisher: DefaultEventPublisher

  constructor () {
    const eventHandler = new EventHandler()
    this.beanFactoryPostProcessor = new EventListenerBeanFactoryPostProcessor(eventHandler)
    this.eventPublisher = new DefaultEventPublisher(eventHandler)
  }

  public getBeanFactoryPostProcessor (): BeanFactoryPostProcessor {
    return this.beanFactoryPostProcessor
  }

  public getEventPublisher (): EventPublisher {
    return this.eventPublisher
  }
}
