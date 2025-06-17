'use strict'

import { Component } from '../../src/revane-ioc/RevaneIOC.js'

@Component
export default class Scan2 {
  test6: any

  constructor (scan1) {
    this.test6 = scan1
  }
}
