import { ApplicationEvent } from './ApplicationEvent'

export interface EventPublisher {
  publishEvent(event: ApplicationEvent): void
}
