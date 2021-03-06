import test from 'ava'
import { Scope, Service } from '../../src/revane-ioc/RevaneIOC'
import {
  scopeSym, idSym, dependenciesSym
} from '../../src/revane-ioc/decorators/Symbols'
import { Reflect } from '../../src/revane-utils/Reflect'

test('should add scope and service meta data', t => {
  @Scope('prototype')
  @Service()
  class TestClass {} // eslint-disable-line

  t.is(Reflect.getMetadata(scopeSym, TestClass), 'prototype')
  t.is(Reflect.getMetadata(idSym, TestClass), 'testClass')
  t.deepEqual(Reflect.getMetadata(dependenciesSym, TestClass), [])
})

test('should add scope and service meta data #2', t => {
  @Scope('prototype')
  @Service({ id: 'test' })
  class TestClass {} // eslint-disable-line

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
