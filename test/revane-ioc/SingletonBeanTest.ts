import * as test from 'tape-catch'
import SingletonBean from '../../src/revane-ioc/bean/SingletonBean'

test('should class postContruct on instance', async (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const bean = new SingletonBean(Clazz, {}, true, { dependencies: [], inject: [] })
  await bean.postConstruct()

  t.ok(bean.getInstance().postConstructed)
})

test('should return Promise on preDestroy()', (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const bean = new SingletonBean(Clazz, {}, true, { dependencies: [], inject: [] })
  bean.preDestroy()
    .then(() => t.pass())
    .catch((err) => t.error(err))
})
