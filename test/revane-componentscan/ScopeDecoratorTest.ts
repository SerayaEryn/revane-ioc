import test from "ava";
import { scopeSym } from "../../src/revane-componentscan/Symbols.js";
import { Scope } from "../../src/revane-ioc/RevaneIOC.js";
import { getMetadata } from "../../src/revane-utils/Metadata.js";

test("should add scope meta data", (t) => {
  class TestClass {}

  Scope("prototype")(TestClass);

  t.is(getMetadata(scopeSym, TestClass), "prototype");
});

test("should add scope meta data #2", (t) => {
  class TestClass {}
  Scope("prototype")(TestClass);

  t.is(getMetadata(scopeSym, TestClass), "prototype");
});
