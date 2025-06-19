import test from "ava";
import { join } from "node:path";
import { beanDefinition, MockedExtension } from "../MockedLoader.js";
import RevaneIOC, { Options } from "../../src/revane-ioc/RevaneIOC.js";
import ConditionalOnMissingBean3 from "../../testdata/conditionalOnMissingBean2/ConditionalOnMissingBean3.js";
import ConditionalOnMissingBean2 from "../../testdata/conditionalOnMissingBean1/ConditionalOnMissingBean2.js";
import ConditionalOnMissingBean1 from "../../testdata/conditionalOnMissingBean1/ConditionalOnMissingBean1.js";

test("should not create conditional bean if not missing", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/conditionalOnMissingBean1"),
    [
      new MockedExtension([
        beanDefinition("conditionalOnMissingBean", ConditionalOnMissingBean1),
        beanDefinition("conditionalOnMissingBean", ConditionalOnMissingBean2),
      ]),
    ],
  );
  options.loaderOptions = [];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();
  t.truthy(await revane.has("conditionalOnMissingBean"));
});

test("should create conditional bean if missing", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/conditionalOnMissingBean2"),
    [
      new MockedExtension([
        beanDefinition("conditionalOnMissingBean", ConditionalOnMissingBean3),
      ]),
    ],
  );
  options.loaderOptions = [];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();
  t.truthy(await revane.has("conditionalOnMissingBean"));
});
