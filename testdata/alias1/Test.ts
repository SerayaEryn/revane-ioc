import { Component, Bean } from "../../src/revane-ioc/RevaneIOC.js";

@Component
export class Outer {
  constructor(
  ) {}
  @Bean({aliasIds: ["alias"]})
  public test() {
    return new Other()
  }
}

class Other {}