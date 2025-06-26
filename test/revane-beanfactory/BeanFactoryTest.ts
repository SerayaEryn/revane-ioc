import * as path from "node:path";
import test from "ava";
import RevaneIOC, {
  BeanFactoryExtension,
  Options,
} from "../../src/revane-ioc/RevaneIOC.js";
import { JsonFileLoaderOptions } from "../../src/revane-ioc/loaders/JsonFileLoaderOptions.js";

test("should create bean using beanFactory", async (t) => {
  const options = new Options(path.join(import.meta.dirname, "../../../"), [
    new BeanFactoryExtension(),
  ]);
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      path.join(import.meta.dirname, "../../../testdata/beanFactory.json"),
    ),
  ];
  options.profile = "test";
  options.configuration = { disabled: true };

  const revane = new RevaneIOC(options);
  await revane.initialize();
  const bean1 = await revane.has("beanFactory");
  const hasTestBean = await revane.has("testBean");
  const hasTestBean2 = await revane.has("testBean2");
  const hasDependsOnBeanFactory = await revane.has("dependsOnBeanFactory");

  await revane.close();

  t.truthy(bean1);
  t.truthy(hasTestBean);
  t.truthy(hasTestBean2);
  t.truthy(hasDependsOnBeanFactory);
  const testBean = await revane.get("testBean");
  t.is(testBean.test, "42");
  t.is(testBean.pre, true);
  t.is(testBean.post, true);
  const testBean2 = await revane.get("testBean2");
  t.is(testBean2.test, "43");
  const dependsOnBeanFactory = await revane.get("dependsOnBeanFactory");
  t.deepEqual(dependsOnBeanFactory.testBean, testBean);
  t.true(await revane.has("hallo0"));
  t.true(await revane.has("hallo1"));
  t.true(await revane.has("hallo2"));
  t.true(await revane.has("testBean4"));
  t.true(await revane.has("blubb"));
});
