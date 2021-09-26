import { Component } from '../../src/revane-ioc/RevaneIOC'
import { Test2 } from './Test2'

@Component
export class Test1 {
  a: Test2
  constructor (a: Test2) {
    this.a = a
  }
}
