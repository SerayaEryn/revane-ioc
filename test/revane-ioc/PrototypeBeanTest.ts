import * as test from 'tape-catch'
import PrototypeBean from '../../src/revane-ioc/bean/PrototypeBean'

test('should class postConstruct on instance', async (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const bean = new PrototypeBean(Clazz, {}, true, { dependencies: [], inject: [] })

  const instance = await bean.getInstance()
  t.ok(instance.postConstructed)
})

test('should handle missing postConstruct on instance', async (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test1')

  const bean = new PrototypeBean(Clazz, {}, true, { dependencies: [], inject: [] })

  t.ok(await bean.getInstance())
})

test('should return Promise on preDestroy()', (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const bean = new PrototypeBean(Clazz, {}, true, { dependencies: [], inject: [] })
  bean.preDestroy()
    .then(() => t.pass())
    .catch((err) => t.error(err))
})

test('should return Promise on postConstruct()', (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const bean = new PrototypeBean(Clazz, {}, true, { dependencies: [], inject: [] })
  bean.postConstruct()
    .then(() => t.pass())
    .catch((err) => t.error(err))
})

test('should handle missing inject', (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const bean = new PrototypeBean(Clazz, {}, true, { dependencies: [] })
  bean.postConstruct()
    .then(() => t.pass())
    .catch((err) => t.error(err))
})

test('should handle inject', async (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const bean = new PrototypeBean(Clazz, {}, true, {
    dependencies: [],
    inject: [
      {
        id: 'test',
        bean: new PrototypeBean(Clazz, {}, true, { dependencies: [] })
      }
    ]
  })
  const instance = await bean.getInstance()
  t.ok(instance.test)
})
