import { Component, Type } from '../../src/revane-ioc/RevaneIOC.js'
import Dependency1 from './Dependency1.js'
import Dependency3 from './Dependency3.js'
import Dependency4 from './Dependency4.js'

@Component
export default class App {
  constructor (
    @Type(Dependency1) public dependency1: Dependency1,
    public dependency2,
    @Type(Dependency3) public dependency3: Dependency3,
    @Type(Dependency4) public dependency4: Dependency4,) {
  }
}
