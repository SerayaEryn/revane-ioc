import 'reflect-metadata'
import * as test from 'tape-catch'
import { Scope, Service, Inject } from '../../src/revane-ioc/RevaneIOC'
import {
  scopeSym, idSym, dependenciesSym, injectSym
} from '../../src/revane-ioc/decorators/Symbols'

test('should add scope and service meta data', t => {
  t.plan(3)
  class TestClass {}

  Scope('prototype')(
  Service()(
  TestClass
  ))

  t.strictEquals(Reflect.getMetadata(scopeSym, TestClass), 'prototype')
  t.strictEquals(Reflect.getMetadata(idSym, TestClass), 'testClass')
  t.deepEquals(Reflect.getMetadata(dependenciesSym, TestClass), [])
})

test('should add scope and service meta data', t => {
  t.plan(3)
  class TestClass {}

  Scope('prototype')(
  Service({ id: 'test' })(
  TestClass
  ))

  t.strictEquals(Reflect.getMetadata(scopeSym, TestClass), 'prototype')
  t.strictEquals(Reflect.getMetadata(idSym, TestClass), 'test')
  t.deepEquals(Reflect.getMetadata(dependenciesSym, TestClass), [])
})

test('should add scope and service meta data', t => {
  t.plan(2)

  @Service
  class TestClass {}

  t.strictEquals(Reflect.getMetadata(idSym, TestClass), 'testClass')
  t.deepEquals(Reflect.getMetadata(dependenciesSym, TestClass), [])
})

test('should add injected dependencies', t => {
  t.plan(1)
  class TestClass {}

  Inject('test1')(
  TestClass
  )

  t.deepEquals(Reflect.getMetadata(injectSym, TestClass), ['test1'])
})

test('should add injected dependencies as list', t => {
  t.plan(1)
  class TestClass {}

  Inject(['test1'])(
  TestClass
  )

  t.deepEquals(Reflect.getMetadata(injectSym, TestClass), ['test1'])
})
