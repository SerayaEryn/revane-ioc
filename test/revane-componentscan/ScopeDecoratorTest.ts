import test from 'ava'
import { scopeSym } from '../../src/revane-componentscan/Symbols'
import { Scope } from '../../src/revane-ioc/RevaneIOC'

test('should add scope meta data', t => {
  class TestClass {} // eslint-disable-line

  Scope('prototype')(TestClass)

  t.is(Reflect.getMetadata(scopeSym, TestClass), 'prototype')
})

test('should add scope meta data #2', t => {
  class TestClass {} // eslint-disable-line

  Scope('prototype')(TestClass)

  t.is(Reflect.getMetadata(scopeSym, TestClass), 'prototype')
})
