import { Component, PostConstruct, PreDestroy, Scope, Scopes } from "../../src/revane-ioc/RevaneIOC"

let callCount = 0

@Scope(Scopes.PROTOTYPE)
@Component
export class Lifecycle1 {
  @PreDestroy
  @PostConstruct
  public postConstruct (): void {
    callCount++
  }

  public getCallcount (): number {
    return callCount
  }
}