import { Component } from '../../src/revane-ioc/RevaneIOC'

@Component()
export default class Scan1 {
  test6: any

  constructor (test6) {
    this.test6 = test6
  }
}

@Component
export class AnotherClass {}
