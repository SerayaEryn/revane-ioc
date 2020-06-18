import * as test from 'tape-catch'
import ValueBean from '../../src/revane-ioc-core/context/bean/ValueBean'

test('should return Promise on postContruct()', (t) => {
  t.plan(1)

  const bean = new ValueBean('test')

  bean.postConstruct()
    .then(() => t.pass())
    .catch((err) => t.error(err))
})

test('should return Promise on preDestroy()', (t) => {
  t.plan(1)

  const bean = new ValueBean('test')

  bean.preDestroy()
    .then(() => t.pass())
    .catch((err) => t.error(err))
})

test('should return null for id', async (t) => {
  t.plan(2)

  const bean = new ValueBean('test')
  await bean.init()
  await bean.postConstruct()
  await bean.preDestroy()
  await bean.executeOnInstance(async () => {
    // ...
  })

  t.equals(bean.id(), null)
  t.equals(bean.type(), null)
})
