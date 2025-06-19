import test from "ava";
import Options from "../../src/revane-ioc/Options.js";
import { join } from "node:path";
import RevaneIOC from "../../src/revane-ioc/RevaneIOC.js";
import { beanDefinition, MockedExtension } from "../MockedLoader.js";
import { ConditionalOnFile1 } from "../../testdata/conditionalOnFile1/ConditionalOnFile1.js";
import { ConditionalOnFile2 } from "../../testdata/conditionalOnFile2/ConditionalOnFile2.js";

test("should create conditional bean if file is present", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/conditionalOnFile1"),
    [
      new MockedExtension([
        beanDefinition("conditionalOnFile1", ConditionalOnFile1),
      ]),
    ],
  );
  options.loaderOptions = [];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();
  t.true(await revane.has("conditionalOnFile1"));
});

test("should not create conditional bean if file is missing", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/conditionalOnFile2"),
    [
      new MockedExtension([
        beanDefinition("conditionalOnFile2", ConditionalOnFile2),
      ]),
    ],
  );
  options.loaderOptions = [];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();
  t.false(await revane.has("conditionalOnFile2"));
});
