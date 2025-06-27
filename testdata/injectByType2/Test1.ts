import { Component, RevaneConfiguration, Type } from '../../src/revane-ioc/RevaneIOC.js'

@Component
export class Test1 {
  config: RevaneConfiguration

  constructor (@Type(RevaneConfiguration) config) {
    this.config = config
  }
}
