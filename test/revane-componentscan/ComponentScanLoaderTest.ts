import { join } from "node:path";
import test from "ava";
import RevaneIOC, {
  BeanDefinition,
  ComponentScanExtension,
  Options,
} from "../../src/revane-ioc/RevaneIOC.js";
import { ComponentScanLoaderOptions } from "../../src/revane-componentscan/ComponentScanLoaderOptions.js";
import ComponentScanLoader from "../../src/revane-componentscan/ComponentScanLoader.js";
import { DependencyDefinition } from "../../src/revane-ioc-core/dependencies/DependencyDefinition.js";
import { Configuration } from "../../src/revane-configuration/Configuration.js";

test("should do component scan without filters", async (t): Promise<void> => {
  t.plan(8);

  const basePackage = join(import.meta.dirname, "../../testdata/scan");
  const options = new ComponentScanLoaderOptions(basePackage, null, null);

  const componentScanResolver = new ComponentScanLoader();
  const beanDefinitions = await componentScanResolver.load([options]);
  t.is(beanDefinitions.length, 5);
  const scan1 = findDefinition(beanDefinitions, "scan1");
  t.is(scan1.scope, "singleton");
  const scan2 = findDefinition(beanDefinitions, "scan2");
  t.is(scan2.scope, "singleton");
  t.deepEqual(scan1.dependencyIds, [
    new DependencyDefinition("bean", "test6", Object),
  ]);
  const scan3 = findDefinition(beanDefinitions, "scan3");
  t.is(scan3.scope, "singleton");
  t.deepEqual(scan3.dependencyIds, [
    new DependencyDefinition("bean", "test6", Object),
  ]);
  const scan4 = findDefinition(beanDefinitions, "scan4");
  t.is(scan4.scope, "singleton");
  t.deepEqual(scan4.dependencyIds, []);
});

test("should support .mjs files", async (t): Promise<void> => {
  t.plan(2);

  const basePackage = join(import.meta.dirname, "../../testdata/mjs");
  const options = new ComponentScanLoaderOptions(basePackage, null, null);

  const componentScanResolver = new ComponentScanLoader();
  const beanDefinitions = await componentScanResolver.load([options]);
  t.is(beanDefinitions.length, 1);
  const scan1 = findDefinition(beanDefinitions, "mjs");
  t.is(scan1.scope, "singleton");
});

test("should do component scan and inject by type", async (t): Promise<void> => {
  const basePackage = join(import.meta.dirname, "../../testdata/injectByType");
  const options = new ComponentScanLoaderOptions(basePackage, null, null);

  const componentScanResolver = new ComponentScanLoader();
  const beanDefinitions = await componentScanResolver.load([options]);
  t.is(beanDefinitions.length, 2);
  const scan1 = findDefinition(beanDefinitions, "test1");
  t.is(scan1.scope, "singleton");
  const scan2 = findDefinition(beanDefinitions, "test2");
  t.is(scan2.scope, "singleton");
});

test("should do component scan with exclude filter", async (t): Promise<void> => {
  const basePackage = join(import.meta.dirname, "../../testdata/scan");
  const options = new ComponentScanLoaderOptions(basePackage, null, [
    {
      type: "regex",
      regex: ".*",
    },
  ]);

  const componentScanLoader = new ComponentScanLoader();
  const beanDefinitions = await componentScanLoader.load([options]);
  t.is(beanDefinitions.length, 0);
});

test("should return correct type", (t) => {
  const componentScanLoader = new ComponentScanLoader();

  t.is(componentScanLoader.type(), "scan");
});

test("should throw error on require error", async (t) => {
  const basePackage = join(
    import.meta.dirname,
    "../../../testdata/loadFailure",
  );
  const options = new ComponentScanLoaderOptions(basePackage, null, null);

  const componentScanResolver = new ComponentScanLoader();
  await t.throwsAsync(
    async () => {
      await componentScanResolver.load([options]);
    },
    { code: "REV_ERR_MODULE_LOAD_ERROR" },
  );
});

test("should throw error on undefined module", async (t) => {
  const basePackage = join(
    import.meta.dirname,
    "../../../testdata/loadFailure2",
  );
  const options = new ComponentScanLoaderOptions(basePackage, null, null);

  const componentScanResolver = new ComponentScanLoader();
  await t.throwsAsync(
    async () => {
      await componentScanResolver.load([options]);
    },
    { code: "REV_ERR_MODULE_LOAD_ERROR" },
  );
});

test("should do component scan with include filter", async (t): Promise<void> => {
  const basePackage = join(import.meta.dirname, "../../testdata/scan");
  const options = new ComponentScanLoaderOptions(
    basePackage,
    [
      {
        type: "regex",
        regex: ".*",
      },
    ],
    null,
  );

  const componentScanResolver = new ComponentScanLoader();
  const beanDefinitions = await componentScanResolver.load([options]);
  t.is(beanDefinitions.length, 5);
});

test("should throw error on invalid scope", async (t) => {
  t.plan(2);

  const options = new Options(join(import.meta.dirname, "../../../testdata"), [
    new ComponentScanExtension(),
  ]);
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      join(import.meta.dirname, "../../../testdata/invalidScope"),
      null,
      null,
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  try {
    await revane.initialize();
  } catch (err) {
    t.truthy(err);
    t.is(err.code, "REV_ERR_INVALID_SCOPE");
  }
});

test("should throw error if dependency throws error", async (t) => {
  t.plan(2);

  const options = new Options(join(import.meta.dirname, "../../../testdata"), [
    new ComponentScanExtension(),
  ]);
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      join(import.meta.dirname, "../../../testdata/dependencyError"),
      null,
      null,
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  try {
    await revane.initialize();
  } catch (err) {
    t.truthy(err);
    t.is(err.code, "REV_ERR_DEPENDENCY_REGISTER");
  }
});

test("should throw error if dependency has itself as dependency", async (t) => {
  t.plan(2);

  const options = new Options(join(import.meta.dirname, "../../../testdata"), [
    new ComponentScanExtension(),
  ]);
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      join(import.meta.dirname, "../../../testdata/dependencyError2"),
      null,
      null,
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  try {
    await revane.initialize();
  } catch (err) {
    t.truthy(err);
    t.is(err.code, "REV_ERR_DEPENDENCY_REGISTER");
  }
});

test("component scan should handle file without bean", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      join(import.meta.dirname, "../../testdata/scan2"),
      null,
      null,
    ),
  ];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();
  t.pass();
});

test("should use auto configuration and execute componentscan", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/autoConfig"),
    [new ComponentScanExtension()],
  );
  options.loaderOptions = [];
  options.profile = "test";
  options.autoConfiguration = true;
  const revane = new RevaneIOC(options);
  await revane.initialize();
  const configuration = (await revane.get("configuration")) as Configuration;
  await revane.get("test");
  t.true(configuration.get("test"));
});

function findDefinition(
  definitions: BeanDefinition[],
  name: string,
): BeanDefinition {
  for (const definition of definitions) {
    if (definition.id === name) {
      return definition;
    }
  }
  throw new Error();
}
