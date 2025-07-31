import { join } from "node:path";
import test from "ava";
import Revane, {
  CacheManager,
  ComponentScanExtension,
  ComponentScanLoaderOptions,
  Options,
} from "../../src/revane-ioc/RevaneIOC.js";
import { CacheMe } from "../../testdata/caching1/CacheMe.js";
import { CacheMe2 } from "../../testdata/caching2/CacheMe2.js";
import { CacheMe3 } from "../../testdata/caching3/CacheMe3.js";
import { CacheMe4 } from "../../testdata/caching4/CacheMe4.js";

test("should get cacheManager", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), []);
  options.loaderOptions = [];
  options.configuration = { disabled: true };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();
  const bean = await revane.get("cacheManager");

  t.truthy(bean);
});

test("should cache method call result", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), [
    new ComponentScanExtension(),
  ]);
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      join(import.meta.dirname, "../../testdata/caching1"),
      [],
      [],
      [],
    ),
  ];
  options.configuration = { disabled: false };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();
  const bean: CacheMe = await revane.get("cacheMe");
  t.is(bean.cacheMePls("test"), 1);
  t.is(bean.cacheMePls("test"), 1);
  t.is(bean.cacheMePls("test2"), 2);
});

test("should evict all entries from cache", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), [
    new ComponentScanExtension(),
  ]);
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      join(import.meta.dirname, "../../testdata/caching4"),
      [],
      [],
      [],
    ),
  ];
  options.configuration = { disabled: false };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();
  const bean: CacheMe4 = await revane.get("cacheMe4");
  t.is(bean.cacheMePls("test1"), 1);
  t.is(bean.cacheMePls("test1"), 1);
  t.is(bean.cacheMePls("test2"), 2);
  t.is(bean.cacheMePls("test2"), 2);
  const cacheManager: CacheManager = await revane.get("cacheManager");
  bean.evictAll();
  t.false(cacheManager.getCache("TEST")?.has("test1"));
  t.false(cacheManager.getCache("TEST")?.has("test2"));
});

test("should cache method call result in correct cache with correct key", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), [
    new ComponentScanExtension(),
  ]);
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      join(import.meta.dirname, "../../testdata/caching2"),
      [],
      [],
      [],
    ),
  ];
  options.configuration = { disabled: false };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();
  const bean: CacheMe2 = await revane.get("cacheMe2");
  const cacheManager: CacheManager = await revane.get("cacheManager");
  t.is(bean.cacheMePls("test", "a"), 1);
  t.is(bean.cacheMePls("test", "a"), 1);
  t.is(bean.cacheMePls("test2", "b"), 2);
  t.is(cacheManager.getCache("TEST1")?.get("testa").value, 1);
  t.is(cacheManager.getCache("TEST2")?.get("test").value, 1);
});

test("should evict from cache", async (t) => {
  const options = new Options(join(import.meta.dirname, "../../testdata"), [
    new ComponentScanExtension(),
  ]);
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      join(import.meta.dirname, "../../testdata/caching3"),
      [],
      [],
      [],
    ),
  ];
  options.configuration = { disabled: false };
  options.profile = "test";
  const revane = new Revane(options);
  await revane.initialize();
  const bean: CacheMe3 = await revane.get("cacheMe3");
  const cacheManager: CacheManager = await revane.get("cacheManager");
  t.is(bean.cacheMePls("test"), 1);
  t.is(bean.cacheMePls("test"), 1);
  bean.evict("test");
  t.false(cacheManager.getCache("TEST")?.has("test"));
});
