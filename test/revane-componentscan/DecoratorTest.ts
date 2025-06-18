import test from "ava";
import {
  dependenciesSym,
  idSym,
  scopeSym,
} from "../../src/revane-componentscan/Symbols.js";
import { Scope, Service } from "../../src/revane-ioc/RevaneIOC.js";

test("should add scope and service meta data", (t) => {
  @Scope("prototype")
  @Service()
  class TestClass {} // eslint-disable-line

  t.is(Reflect.getMetadata(scopeSym, TestClass), "prototype");
  t.is(Reflect.getMetadata(idSym, TestClass), "testClass");
  t.deepEqual(Reflect.getMetadata(dependenciesSym, TestClass), []);
});

test("should add scope and service meta data #2", (t) => {
  @Scope("prototype")
  @Service({ id: "test" })
  class TestClass {} // eslint-disable-line

  t.is(Reflect.getMetadata(scopeSym, TestClass), "prototype");
  t.is(Reflect.getMetadata(idSym, TestClass), "test");
  t.deepEqual(Reflect.getMetadata(dependenciesSym, TestClass), []);
});

test("should add scope and service meta data #3", (t) => {
  @Service
  class TestClass {}

  t.is(Reflect.getMetadata(idSym, TestClass), "testClass");
  t.deepEqual(Reflect.getMetadata(dependenciesSym, TestClass), []);
});
