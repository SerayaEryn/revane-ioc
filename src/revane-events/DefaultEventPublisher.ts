import { ApplicationEventPublisher as EventPublisher } from './RevaneEvents'
import { ApplicationEvent } from './ApplicationEvent'
import { EventHandler } from './EventHandler'

export class DefaultEventPublisher implements EventPublisher {
  private readonly eventHandler: EventHandler

  constructor (eventHandler: EventHandler) {
    this.eventHandler = eventHandler
  }

  publishEvent (event: ApplicationEvent): void {
    this.eventHandler.publishEvent(event)
  }
}
