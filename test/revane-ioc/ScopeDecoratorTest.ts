import 'reflect-metadata'
import test from 'ava'
import { Scope } from '../../src/revane-ioc/RevaneIOC'
import { scopeSym } from '../../src/revane-ioc/decorators/Symbols'

test('should add scope meta data', t => {
  class TestClass {}

  Scope('prototype')(
  TestClass
  )

  t.is(Reflect.getMetadata(scopeSym, TestClass), 'prototype')
})

test('should add scope meta data #2', t => {
  class TestClass {}

  Scope('prototype')(
  TestClass
  )

  t.is(Reflect.getMetadata(scopeSym, TestClass), 'prototype')
})
