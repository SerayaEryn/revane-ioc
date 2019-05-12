import 'reflect-metadata'
import * as test from 'tape-catch'
import { Scope } from '../../src/revane-ioc/RevaneIOC'
import { scopeSym } from '../../src/revane-ioc/decorators/Symbols'

test('should add scope meta data', t => {
  t.plan(1)

  class TestClass {}

  Scope('prototype')(
  TestClass
  )

  t.strictEquals(Reflect.getMetadata(scopeSym, TestClass), 'prototype')
})

test('should add scope meta data', t => {
  t.plan(1)
  class TestClass {}

  Scope('prototype')(
  TestClass
  )

  t.strictEquals(Reflect.getMetadata(scopeSym, TestClass), 'prototype')
})
