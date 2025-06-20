import { join } from "node:path";
import RevaneIOC, {
  ComponentScanExtension,
  ComponentScanLoaderOptions,
  Options,
} from "../../src/revane-ioc/RevaneIOC.js";
import test from "ava";

test("should get beans type component", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), [
    new ComponentScanExtension(),
  ]);
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      join(import.meta.dirname, "../../testdata/injectByType"),
      [],
      [],
      [],
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();

  const bean1 = await revane.get("test1");
  const bean2 = await revane.get("test2");

  t.is(bean1.a, bean2);
});

test("should not use object type for inejction", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), [
    new ComponentScanExtension(),
  ]);
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      join(import.meta.dirname, "../../testdata/scan3"),
      [],
      [],
      [],
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();

  const bean1 = await revane.get("scan1");
  const bean2 = await revane.get("scan2");

  t.is(bean2.test6, bean1);
});
