import { Component, PostConstruct, Scope, Scopes } from "../../src/revane-ioc/RevaneIOC.js"

let callCount = 0

@Scope(Scopes.PROTOTYPE)
@Component
export class Lifecycle2 {
  @PostConstruct
  public postConstruct (): void {
    callCount++
  }

  public getCallcount (): number {
    return callCount
  }
}