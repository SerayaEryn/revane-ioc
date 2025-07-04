import test from "ava";
import ValueBean from "../../src/revane-ioc-core/context/bean/ValueBean.js";

test("should return Promise on postContruct()", async (t) => {
  const bean = new ValueBean("test");

  await bean.postConstruct();
  t.pass();
});

test("should return Promise on preDestroy()", async (t) => {
  const bean = new ValueBean("test");

  await bean.preDestroy();
  t.pass();
});

test("should return id", async (t) => {
  const bean = new ValueBean("test");
  await bean.init();
  await bean.postConstruct();
  await bean.preDestroy();

  t.truthy(bean.id());
  t.truthy(bean.type());
});
