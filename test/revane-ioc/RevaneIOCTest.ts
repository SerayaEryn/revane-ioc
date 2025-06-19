import { join } from "node:path";
import test from "ava";
import Revane, { Options, Scopes } from "../../src/revane-ioc/RevaneIOC.js";
import { JsonFileLoaderOptions } from "../../src/revane-ioc/loaders/JsonFileLoaderOptions.js";
import { XmlFileLoaderOptions } from "../../src/revane-ioc/loaders/XmlFileLoaderOptions.js";
import { beanDefinition, MockedExtension } from "../MockedLoader.js";
import { Lifecycle1 } from "../../testdata/lifecycle1/Lifecycle1.js";
import { Lifecycle2 } from "../../testdata/lifecycle2/Lifecycle2.js";
import Test1 from "../../testdata/test1.js";
import ConditionalOnMissingBean3 from "../../testdata/conditionalOnMissingBean2/ConditionalOnMissingBean3.js";
import ConditionalOnMissingBean2 from "../../testdata/conditionalOnMissingBean1/ConditionalOnMissingBean2.js";
import ConditionalOnMissingBean1 from "../../testdata/conditionalOnMissingBean1/ConditionalOnMissingBean1.js";

test("should read json configuration file and register beans", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  options.noRedefinition = true;
  const revane = new Revane(options);
  await revane.initialize();
  const bean1 = await revane.get("json1");
  const bean2 = await revane.get("json2");

  t.truthy(bean1);
  t.truthy(bean2);
  t.truthy(bean2.json1);
});

test("should register bean", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  options.noRedefinition = true;
  const revane = new Revane(options);
  revane.registerBean("test", { test: "Hallo Welt" });
  await revane.initialize();
  const bean1 = await revane.get("test");

  t.is(bean1.test, "Hallo Welt");
});

test("should throw error on unknown id", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();
  await t.throwsAsync(
    async () => {
      await revane.get("blub");
    },
    { code: "REV_ERR_NOT_FOUND" },
  );
});

test("should throw error if not initialized #1", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../../testdata"),
    [],
  );
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  try {
    await revane.get("blub");
  } catch (err) {
    t.is(err.code, "REV_ERR_NOT_INITIALIZED");
  }
});

test("should throw error if not initialized #2", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../../testdata"),
    [],
  );
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  try {
    await revane.getByType("controller");
  } catch (err) {
    t.is(err.code, "REV_ERR_NOT_INITIALIZED");
  }
});

test("should throw error if not initialized #3", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../../testdata"),
    [],
  );
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  try {
    await revane.getMultiple(["test6"]);
  } catch (err) {
    t.is(err.code, "REV_ERR_NOT_INITIALIZED");
  }
});

test("should use parent context", async (t) => {
  const options1 = new Options(join(import.meta.dirname, "../../testdata"), []);
  options1.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config.json"),
    ),
  ];
  options1.configuration = { disabled: true };
  options1.profile = "test";
  const revane1 = new Revane(options1);

  const options2 = new Options(join(import.meta.dirname, "../../testdata"), []);
  options2.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config4.json"),
    ),
  ];
  options2.configuration = { disabled: true };
  options2.profile = "test";
  const revane2 = new Revane(options2);
  await revane1.initialize();
  await revane2.initialize();
  revane1.setParent(revane2);
  const bean1 = await revane1.get("json1");
  const bean2 = await revane1.get("json2");

  t.truthy(bean1);
  t.truthy(bean2);
  t.truthy(bean2.json1);
  const bean6 = await revane1.get("test6");
  const bean12 = await revane1.get("test12");
  t.truthy(bean6);
  t.truthy(bean12);
});

test("should read json configuration file and register beans #2", async (t) => {
  t.plan(4);

  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config3.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();
  const bean1 = await revane.get("json1");
  const bean2 = await revane.get("json2");
  const bean3 = await revane.get("json3");

  t.truthy(bean1);
  t.truthy(bean2);
  t.truthy(bean2.json1);
  t.truthy(bean3);
});

test("should return if beans exist()", async (t) => {
  t.plan(4);

  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config3.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();

  t.truthy(await revane.has("json1"));
  t.truthy(await revane.has("json2"));
  t.truthy(await revane.has("json3"));
  t.truthy(!(await revane.has("test")));
});

test("should fallback to default profile", async (t) => {
  t.plan(2);

  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config3.json"),
    ),
  ];
  const revane = new Revane(options);
  await revane.initialize();
  const configuration = await revane.get("configuration");

  t.is(configuration.get("revane.original-profile"), null);
  t.is(configuration.getString("revane.profile"), "default");
});

test("should read json and xml configuration file and register beans", async (t) => {
  t.plan(6);

  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config.json"),
    ),
    new XmlFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/xml/config.xml"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();
  const bean1 = await revane.get("json1");
  const bean2 = await revane.get("json2");
  const bean3 = await revane.get("xml1");
  const bean4 = await revane.get("xml2");

  t.truthy(bean1);
  t.truthy(bean2);
  t.is(bean2.json1, bean1);
  t.truthy(bean3);
  t.truthy(bean4);
  t.truthy(bean4.xml1);
});

test("should create bean for module", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../../testdata"),
    [],
  );
  options.loaderOptions = [
    new XmlFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/xml/config3.xml"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();
  const bean = await revane.get("http");
  t.truthy(bean);
});

test("should tearDown", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [
    new XmlFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/xml/config4.xml"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();
  const bean = await revane.get("xml2");
  await revane.close();
  t.true(bean.destroyed);
});

test("should read not reject on missing paths", async (t): Promise<void> => {
  t.plan(1);

  const options = new Options(
    join(import.meta.dirname, "../../../testdata"),
    [],
  );
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  return await revane.initialize().then(() => {
    t.pass();
  });
});

test("should read json config file and reject on missing dependency", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config2.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  return await revane.initialize().catch((err) => {
    t.truthy(err);
    t.is(err.code, "REV_ERR_DEPENDENCY_NOT_FOUND");
  });
});

test("should reject error on unknown configuration file ending - json", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config2.test"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  return await revane.initialize().catch((err) => {
    t.truthy(err);
    t.is(err.code, "REV_ERR_UNKNOWN_ENDING");
  });
});

test("should reject error on unknown configuration file ending - xml", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [
    new XmlFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config2.test"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  return await revane.initialize().catch((err) => {
    t.truthy(err);
    t.is(err.code, "REV_ERR_UNKNOWN_ENDING");
  });
});

test("should throw error on get() if not initialized", async (t): Promise<void> => {
  t.plan(2);

  const options = new Options(
    join(import.meta.dirname, "../../../testdata"),
    [],
  );
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  try {
    await revane.get("test");
  } catch (err) {
    t.truthy(err);
    t.is(err.code, "REV_ERR_NOT_INITIALIZED");
  }
});

test("should throw error on has() if not initialized", async (t): Promise<void> => {
  t.plan(2);

  const options = new Options(
    join(import.meta.dirname, "../../../testdata"),
    [],
  );
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  try {
    await revane.has("test");
  } catch (err) {
    t.truthy(err);
    t.is(err.code, "REV_ERR_NOT_INITIALIZED");
  }
});

test("should throw error on getMultiple if not initialized", async (t) => {
  t.plan(2);

  const options = new Options(
    join(import.meta.dirname, "../../../testdata"),
    [],
  );
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  try {
    await revane.getMultiple(["test"]);
  } catch (err) {
    t.truthy(err);
    t.is(err.code, "REV_ERR_NOT_INITIALIZED");
  }
});

test("should throw error if bean was defined twice", async (t) => {
  t.plan(2);

  const options = new Options(join(import.meta.dirname, "../../../testdata"), [
    new MockedExtension([
      beanDefinition("scan1", Test1),
      beanDefinition("scan1", Test1),
    ]),
  ]);
  options.loaderOptions = [];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  try {
    await revane.initialize();
  } catch (err) {
    t.truthy(err);
    t.is(err.code, "REV_ERR_DEFINED_TWICE");
  }
});

test("should not throw error if bean redefinition is allowed", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../../testdata/definedTwice"),
    [
      new MockedExtension([
        beanDefinition("scan1", Test1),
        beanDefinition("scan1", Test1),
      ]),
    ],
  );
  options.loaderOptions = [];
  options.configuration = { disabled: false };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();
  t.truthy(await revane.has("scan1"));
});

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
  const revane = new Revane(options);
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
  const revane = new Revane(options);
  await revane.initialize();
  t.truthy(await revane.has("conditionalOnMissingBean"));
});

test("should return multiple beans", async (t) => {
  const basePackage = join(import.meta.dirname, "../../testdata");
  const options = new Options(basePackage, []);
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();
  const [json1, json2] = await revane.getMultiple(["json1", "json2"]);
  t.truthy(json1);
  t.truthy(json2);
});

test("should throw error on getByType if not initialized", async (t) => {
  t.plan(2);

  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [
    new JsonFileLoaderOptions(
      join(import.meta.dirname, "../../../testdata/json/config.json"),
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  try {
    await revane.getByType("test");
  } catch (err) {
    t.truthy(err);
    t.is(err.code, "REV_ERR_NOT_INITIALIZED");
  }
});

test("should get beans type component", async (t) => {
  const beanDefinition1 = beanDefinition("test1", Test1);
  beanDefinition1.type = "component";
  const beanDefinition2 = beanDefinition("test2", Test1);
  beanDefinition2.type = "service";
  const options = new Options(join(import.meta.dirname, "../../testdata"), [
    new MockedExtension([beanDefinition1, beanDefinition2]),
  ]);
  options.loaderOptions = [];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();
  const beans = await revane.getByType("component");

  t.is(1, beans.length);
  t.truthy(beans[0]);
});

test("should invoke lifecycle methods for bean with scope prototype", async (t) => {
  const beanDefinition1 = beanDefinition("test", Lifecycle1);
  beanDefinition1.scope = Scopes.PROTOTYPE;
  const options = new Options(
    join(import.meta.dirname, "../../testdata/lifecycle"),
    [new MockedExtension([beanDefinition1])],
  );
  options.loaderOptions = [];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();

  await revane.get("test");
  const bean = await revane.get("test");
  await revane.close();
  t.is(bean.getCallcount(), 4);
});

test("should not try to call no existant preDestroy hook", async (t) => {
  const beanDefinition1 = beanDefinition("test", Lifecycle2);
  beanDefinition1.scope = Scopes.PROTOTYPE;
  const options = new Options(
    join(import.meta.dirname, "../../testdata/lifecycle"),
    [new MockedExtension([beanDefinition1])],
  );
  options.loaderOptions = [];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();

  await revane.get("test");
  const bean = await revane.get("test");
  await revane.close();
  t.is(bean.getCallcount(), 2);
});
