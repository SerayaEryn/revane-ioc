import { join } from "node:path";
import test from "ava";
import XmlFileLoader from "../../src/revane-ioc/loaders/XmlFileLoader.js";
import { XmlFileLoaderOptions } from "../../src/revane-ioc/loaders/XmlFileLoaderOptions.js";

test("should read xml configuration file and register beans", async (t): Promise<void> => {
  t.plan(1);
  const file = join(import.meta.dirname, "../../../testdata/xml/config.xml");

  const xmlFileResolver = new XmlFileLoader();

  return await xmlFileResolver
    .load([new XmlFileLoaderOptions(file)])
    .then((beanDefinitions) => {
      t.is(beanDefinitions.length, 3);
    });
});

test("should reject on error", async (t) => {
  const file = join(import.meta.dirname, "../../../testdata/json/configa.json");

  const xmlFileLoader = new XmlFileLoader();

  await t.throwsAsync(async () => {
    await xmlFileLoader.load([new XmlFileLoaderOptions(file)]);
  });
});

test("should return correct type", (t) => {
  const xmlFileLoader = new XmlFileLoader();

  t.is(xmlFileLoader.type(), "xml");
});
