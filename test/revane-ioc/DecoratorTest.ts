import 'reflect-metadata'
import test from 'ava'
import { Scope, Service } from '../../src/revane-ioc/RevaneIOC'
import {
  scopeSym, idSym, dependenciesSym
} from '../../src/revane-ioc/decorators/Symbols'

test('should add scope and service meta data', t => {
  class TestClass {}

  Scope('prototype')(
  Service()(
  TestClass
  ))

  t.is(Reflect.getMetadata(scopeSym, TestClass), 'prototype')
  t.is(Reflect.getMetadata(idSym, TestClass), 'testClass')
  t.deepEqual(Reflect.getMetadata(dependenciesSym, TestClass), [])
})

test('should add scope and service meta data #2', t => {
  class TestClass {}

  Scope('prototype')(
  Service({ id: 'test' })(
  TestClass
  ))

  t.is(Reflect.getMetadata(scopeSym, TestClass), 'prototype')
  t.is(Reflect.getMetadata(idSym, TestClass), 'test')
  t.deepEqual(Reflect.getMetadata(dependenciesSym, TestClass), [])
})

test('should add scope and service meta data #3', t => {
  @Service
  class TestClass {}

  t.is(Reflect.getMetadata(idSym, TestClass), 'testClass')
  t.deepEqual(Reflect.getMetadata(dependenciesSym, TestClass), [])
})
