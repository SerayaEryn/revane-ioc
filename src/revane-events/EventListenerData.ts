export class EventListenerData {
  private readonly methodName: string
  private readonly eventName: string

  constructor (eventName: string, methodName: string) {
    this.eventName = eventName
    this.methodName = methodName
  }

  public getEventName (): string {
    return this.eventName
  }

  public getMethodName (): string {
    return this.methodName
  }
}
