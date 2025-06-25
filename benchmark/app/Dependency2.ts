import { Component, Type } from '../../src/revane-ioc/RevaneIOC.js'
import { Lifecycle1 } from './Lifecycle1.js';

@Component
export default class Dependency2 {
  constructor (@Type(Lifecycle1) public lifeCycle: Lifecycle1) {
  }
}
