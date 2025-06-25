import { Component, Type } from '../../src/revane-ioc/RevaneIOC.js'
import Dependency1 from './Dependency1.js'

@Component
export default class App {
  constructor (
    @Type(Dependency1) public dependency1: Dependency1,
    public dependency2) {
  }
}
