'use strict'

import { Component } from '../../src/revane-ioc/RevaneIOC'

@Component('scan2')
export default class Scan1 {
  test6: any

  constructor (test6) {
    this.test6 = test6
  }
}
