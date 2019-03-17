import 'reflect-metadata'
import * as test from 'tape-catch'
import { Scope, Service, Inject } from '../../src/revane-ioc/RevaneIOC'

test('should add scope and service meta data', t => {
  t.plan(3)
  class TestClass {}

  Scope('prototype')(
  Service()(
  TestClass
  ))

  t.strictEquals(Reflect.getMetadata('scope', TestClass), 'prototype')
  t.strictEquals(Reflect.getMetadata('id', TestClass), 'testClass')
  t.deepEquals(Reflect.getMetadata('dependencies', TestClass), [])
})

test('should add scope and service meta data', t => {
  t.plan(3)
  class TestClass {}

  Scope('prototype')(
  Service({ id: 'test' })(
  TestClass
  ))

  t.strictEquals(Reflect.getMetadata('scope', TestClass), 'prototype')
  t.strictEquals(Reflect.getMetadata('id', TestClass), 'test')
  t.deepEquals(Reflect.getMetadata('dependencies', TestClass), [])
})

test('should add injected dependencies', t => {
  t.plan(1)
  class TestClass {}

  Inject('test1')(
  TestClass
  )

  t.deepEquals(Reflect.getMetadata('inject', TestClass), ['test1'])
})

test('should add injected dependencies as list', t => {
  t.plan(1)
  class TestClass {}

  Inject(['test1'])(
  TestClass
  )

  t.deepEquals(Reflect.getMetadata('inject', TestClass), ['test1'])
})
