import { Component } from '../../src/revane-ioc/RevaneIOC.js'

@Component('scan2')
export default class Scan1 {
  test6: any

  constructor (test6) {
    this.test6 = test6
  }
}
