import test from "ava";
import { join } from "node:path";
import { beanDefinition, MockedExtension } from "../MockedLoader.js";
import RevaneIOC, { Options } from "../../src/revane-ioc/RevaneIOC.js";
import { ConditionalOnProperty1 } from "../../testdata/conditionalOnProperty1/ConditionalOnProperty1.js";
import { ConditionalOnProperty2 } from "../../testdata/conditionalOnProperty2/ConditionalOnProperty2.js";
import { ConditionalOnProperty3 } from "../../testdata/conditionalOnProperty3/ConditionalOnProperty3.js";

test("should not create conditional bean if property is present", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/conditionalOnProperty1"),
    [
      new MockedExtension([
        beanDefinition("conditionalOnProperty1", ConditionalOnProperty1),
      ]),
    ],
  );
  options.loaderOptions = [];
  options.configuration = { disabled: false };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();
  t.true(await revane.has("conditionalOnProperty1"));
});

test("should create conditional bean if property is missing", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/conditionalOnProperty2"),
    [
      new MockedExtension([
        beanDefinition("conditionalOnProperty2", ConditionalOnProperty2),
      ]),
    ],
  );
  options.loaderOptions = [];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();
  t.false(await revane.has("conditionalOnProperty2"));
});

test("should create conditional bean with fallback if property is missing ", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/conditionalOnProperty3"),
    [
      new MockedExtension([
        beanDefinition("conditionalOnProperty3", ConditionalOnProperty3),
      ]),
    ],
  );
  options.loaderOptions = [];
  options.configuration = { disabled: false };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();
  t.true(await revane.has("conditionalOnProperty3"));
});
