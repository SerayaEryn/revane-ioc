import { Component } from '../../src/revane-ioc/RevaneIOC.js'
import { Test2 } from './Test2.js'

@Component
export class Test1 {
  a: Test2
  constructor (a: Test2) {
    this.a = a
  }
}
