import { ApplicationEvent } from './ApplicationEvent'

export interface ApplicationEventListener {
  onApplicationEvent(event: ApplicationEvent): void
}
