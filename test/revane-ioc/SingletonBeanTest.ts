import * as test from 'tape-catch'
import SingletonBean from '../../src/revane-ioc/bean/SingletonBean'
import { BeanDefinition } from '../../src/revane-ioc/RevaneIOC'

test('should class postContruct on instance', async (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz
  const bean = new SingletonBean(beanDefinition)
  await bean.init()
  await bean.postConstruct()

  const instance = await bean.getInstance()
  t.ok(instance.postConstructed)
})

test('should return Promise on preDestroy()', async (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz
  const bean = new SingletonBean(beanDefinition)
  await bean.init()
  return bean.preDestroy()
    .then(() => t.pass())
    .catch((err) => t.error(err))
})
