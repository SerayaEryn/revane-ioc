import { Component, PostConstruct, PreDestroy, Scope } from "../../src/revane-ioc/RevaneIOC"

let callCount = 0

@Scope('prototype')
@Component
export class Test {
  @PostConstruct
  public postConstruct (): void {
    callCount++
  }

  public getCallcount (): number {
    return callCount
  }
}