import test from "ava";
import {
  dependenciesSym,
  idSym,
  scopeSym,
} from "../../src/revane-componentscan/Symbols.js";
import { Scope, Service } from "../../src/revane-ioc/RevaneIOC.js";
import { getMetadata } from "../../src/revane-utils/Metadata.js";

test("should add scope and service meta data", (t) => {
  @Scope("prototype")
  @Service()
  class TestClass {}

  t.is(getMetadata(scopeSym, TestClass), "prototype");
  t.is(getMetadata(idSym, TestClass), "testClass");
  t.deepEqual(getMetadata(dependenciesSym, TestClass), []);
});

test("should add scope and service meta data #2", (t) => {
  @Scope("prototype")
  @Service({ id: "test" })
  class TestClass {}

  t.is(getMetadata(scopeSym, TestClass), "prototype");
  t.is(getMetadata(idSym, TestClass), "test");
  t.deepEqual(getMetadata(dependenciesSym, TestClass), []);
});

test("should add scope and service meta data #3", (t) => {
  @Service
  class TestClass {}

  t.is(getMetadata(idSym, TestClass), "testClass");
  t.deepEqual(getMetadata(dependenciesSym, TestClass), []);
});
