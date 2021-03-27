import { EventEmitter } from 'events'
import { ApplicationEvent } from './ApplicationEvent'

export class EventHandler {
  private readonly eventEmitter: EventEmitter = new EventEmitter()

  public registerEventListener (
    name: string,
    eventListener: (...args: any[]) => void
  ): void {
    this.eventEmitter.addListener(name, eventListener)
  }

  public publishEvent (event: ApplicationEvent): void {
    this.eventEmitter.emit(event.getEventName(), event)
  }
}
