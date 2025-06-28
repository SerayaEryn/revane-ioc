import { Component, Type } from '../../src/revane-ioc/RevaneIOC.js'
import {Test } from './BeanFactory.js'

@Component
export default class DependsOnBeanFactory {
  testBean: any

  constructor (@Type(Test) test: any) {
    this.testBean = test
  }
}
