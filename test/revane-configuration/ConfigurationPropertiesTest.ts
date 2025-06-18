import { join } from "node:path";
import test from "ava";
import Revane, { Options } from "../../src/revane-ioc/RevaneIOC.js";
import { RevaneConfiguration } from "../../src/revane-configuration/RevaneConfiguration.js";
import { beanDefinition, MockedExtension } from "../MockedLoader.js";
import { ConfigurationProperties1 } from "../../testdata/configurationProperties/configurationProperties.js";
import { ConfigurationProperties2 } from "../../testdata/configurationProperties2/ConfigurationProperties2.js";
import { ConfigurationProperties3 } from "../../testdata/configurationProperties3/ConfigurationProperties3.js";
import { ConfigurationProperties4 } from "../../testdata/configurationPropertiesProperties1/ConfigurationProperties4.js";
import { ConfigurationProperties5 } from "../../testdata/configurationPropertiesProperties2/ConfigurationProperties5.js";
import { ConfigurationProperties6 } from "../../testdata/configurationPropertiesProperties3/ConfigurationProperties6.js";
import { ConfigurationProperties7 } from "../../testdata/configurationPropertiesYml1/ConfigurationProperties7.js";
import { ConfigurationProperties8 } from "../../testdata/configurationPropertiesYml2/ConfigurationProperties8.js";
import { ConfigurationProperties9 } from "../../testdata/configurationPropertiesYml3/ConfigurationProperties9.js";

test("should add configuration properties", async (t) => {
  t.plan(4);

  const options = new Options(
    join(import.meta.dirname, "../../../testdata/configurationProperties"),
    [new MockedExtension([beanDefinition("scan5", ConfigurationProperties1)])],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/configurationProperties/testconfig",
    ),
  };
  options.profile = "test";

  const revane = new Revane(options);
  await revane.initialize();

  const configuration: RevaneConfiguration = await revane.get("configuration");
  t.is(configuration.getString("test.property1"), "hello world");
  t.is(configuration.getNumber("test.property2"), 43);
  const configurationProperties = await revane.get("scan5");
  t.is(configurationProperties.property1, "hello world");
  t.is(configurationProperties.property2, 43);
});

test("should add configuration properties #2", async (t) => {
  t.plan(4);

  const options = new Options(
    join(import.meta.dirname, "../../../testdata/configurationProperties2"),
    [new MockedExtension([beanDefinition("scan56", ConfigurationProperties2)])],
  );
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/configurationProperties2/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();

  const configuration: RevaneConfiguration = await revane.get("configuration");
  t.is(configuration.getString("test.property1"), "hello world");
  t.is(configuration.getNumber("test.property2"), 44);
  const configurationProperties = await revane.get("scan56");
  t.is(configurationProperties.property1, "hello world");
  t.is(configurationProperties.property2, 44);
});

test("should add configuration properties and use REVANE_PROFILE=test", async (t) => {
  t.plan(4);

  process.env.REVANE_PROFILE = "test";
  const options = new Options(
    join(import.meta.dirname, "../../../testdata/configurationProperties2"),
    [new MockedExtension([beanDefinition("scan56", ConfigurationProperties2)])],
  );
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/configurationProperties2/testconfig",
    ),
  };
  const revane = new Revane(options);
  await revane.initialize();

  const configuration: RevaneConfiguration = await revane.get("configuration");
  t.is(configuration.getString("test.property1"), "hello world");
  t.is(configuration.getNumber("test.property2"), 44);
  const configurationProperties = await revane.get("scan56");
  t.is(configurationProperties.property1, "hello world");
  t.is(configurationProperties.property2, 44);
});

test("should add configuration properties #3", async (t) => {
  t.plan(4);

  const options = new Options(
    join(import.meta.dirname, "../../../testdata/configurationProperties3"),
    [new MockedExtension([beanDefinition("scan56", ConfigurationProperties3)])],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/configurationProperties3/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();

  const configuration: RevaneConfiguration = await revane.get("configuration");
  t.is(configuration.getString("test.property1"), "hello world");
  t.is(configuration.getNumber("test.property2"), 44);
  const configurationProperties = await revane.get("scan56");
  t.is(configurationProperties.property1, "hello world");
  t.is(configurationProperties.property2, 44);
});

test("should add configuration properties from yaml #1", async (t) => {
  t.plan(4);

  const options = new Options(
    join(import.meta.dirname, "../../../testdata/configurationPropertiesYml1"),
    [new MockedExtension([beanDefinition("scan56", ConfigurationProperties4)])],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/configurationPropertiesYml1/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();

  const configuration: RevaneConfiguration = await revane.get("configuration");
  t.is(configuration.getString("test.property1"), "hello world");
  t.is(configuration.getNumber("test.property2"), 44);
  const configurationProperties = await revane.get("scan56");
  t.is(configurationProperties.property1, "hello world");
  t.is(configurationProperties.property2, 44);
});

test("should add configuration properties from yaml #2", async (t) => {
  t.plan(4);

  const options = new Options(
    join(import.meta.dirname, "../../../testdata/configurationPropertiesYml2"),
    [new MockedExtension([beanDefinition("scan56", ConfigurationProperties5)])],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/configurationPropertiesYml2/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();

  const configuration: RevaneConfiguration = await revane.get("configuration");
  t.is(configuration.getString("test.property1"), "hello world");
  t.is(configuration.getNumber("test.property2"), 43);
  const configurationProperties = await revane.get("scan56");
  t.is(configurationProperties.property1, "hello world");
  t.is(configurationProperties.property2, 43);
});

test("should add configuration properties from yaml and replace env vars", async (t) => {
  t.plan(4);

  process.env.A_ENV_VAR = "a env var";
  const options = new Options(
    join(import.meta.dirname, "../../../testdata/configurationPropertiesYml3"),
    [new MockedExtension([beanDefinition("scan56", ConfigurationProperties6)])],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/configurationPropertiesYml3/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();

  const configuration: RevaneConfiguration = await revane.get("configuration");
  t.is(configuration.getString("test.property1"), "hello world");
  t.is(configuration.getString("test.property2"), "a env var");
  const configurationProperties = await revane.get("scan56");
  t.is(configurationProperties.property1, "hello world");
  t.is(configurationProperties.property2, "a env var");
});

test("should add configuration properties from properties #1", async (t) => {
  t.plan(6);

  const options = new Options(
    join(
      import.meta.dirname,
      "../../../testdata/configurationPropertiesProperties1",
    ),
    [new MockedExtension([beanDefinition("scan56", ConfigurationProperties7)])],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/configurationPropertiesProperties1/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();

  const configuration: RevaneConfiguration = await revane.get("configuration");
  t.is(configuration.getString("test.property1"), "hello world");
  t.is(configuration.getNumber("test.property2"), 44);
  t.is(configuration.getBoolean("test.test2.property3"), false);
  t.is(configuration.getBoolean("test.test2.property4"), true);
  const configurationProperties = await revane.get("scan56");
  t.is(configurationProperties.property1, "hello world");
  t.is(configurationProperties.property2, 44);
});

test("should add configuration properties from properties #2", async (t) => {
  t.plan(4);

  const options = new Options(
    join(
      import.meta.dirname,
      "../../../testdata/configurationPropertiesProperties2",
    ),
    [new MockedExtension([beanDefinition("scan56", ConfigurationProperties8)])],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/configurationPropertiesProperties2/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();

  const configuration: RevaneConfiguration = await revane.get("configuration");
  t.is(configuration.getString("test.property1"), "hello world");
  t.is(configuration.getNumber("test.property2"), 43);
  const configurationProperties = await revane.get("scan56");
  t.is(configurationProperties.property1, "hello world");
  t.is(configurationProperties.property2, 43);
});

test("should add configuration properties from properties and replace env vars", async (t) => {
  t.plan(4);

  process.env.A_ENV_VAR = "a env var";
  const options = new Options(
    join(
      import.meta.dirname,
      "../../../testdata/configurationPropertiesProperties3",
    ),
    [new MockedExtension([beanDefinition("scan56", ConfigurationProperties9)])],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/configurationPropertiesProperties3/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();

  const configuration: RevaneConfiguration = await revane.get("configuration");
  t.is(configuration.getString("test.property1"), "hello world");
  t.is(configuration.getString("test.property2"), "a env var");
  const configurationProperties = await revane.get("scan56");
  t.is(configurationProperties.property1, "hello world");
  t.is(configurationProperties.property2, "a env var");
});
