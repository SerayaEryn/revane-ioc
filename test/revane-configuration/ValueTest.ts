import { join } from "node:path";
import test from "ava";
import Revane, {
  ComponentScanExtension,
  ComponentScanLoaderOptions,
  Options,
} from "../../src/revane-ioc/RevaneIOC.js";
import { TestValue } from "../../testdata/value/TestValue.js";

test("should add configuration properties", async (t) => {
  t.plan(4);

  const options = new Options(
    join(import.meta.dirname, "../../../testdata/value"),
    [new ComponentScanExtension()],
  );

  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      join(import.meta.dirname, "../../testdata/value"),
      [],
      [],
      [],
    ),
  ];
  options.configuration = {
    disabled: false,
    directory: join(import.meta.dirname, "../../../testdata/value/testconfig"),
  };
  options.profile = "test";

  const revane = new Revane(options);
  await revane.initialize();

  const testValue: TestValue = await revane.get("testValue");
  t.is(testValue.property1, "hello world");
  t.is(testValue.property4, "hello world");
  t.is(testValue.property2, 43);
  t.is(testValue.property3, true);
});
