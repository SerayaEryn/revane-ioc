import test from 'ava'
import SingletonBean from '../../src/revane-ioc/bean/SingletonBean'
import { BeanDefinition } from '../../src/revane-ioc/RevaneIOC'

test('should class postContruct on instance', async (t) => {
  const Clazz = require('../../../testdata/test6') // eslint-disable-line

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz
  const bean = new SingletonBean(beanDefinition)
  await bean.init()
  await bean.postConstruct()

  const instance = await bean.getInstance()
  t.truthy(instance.postConstructed)
})

test('should return Promise on preDestroy()', async (t) => {
  const Clazz = require('../../../testdata/test6') // eslint-disable-line

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz
  const bean = new SingletonBean(beanDefinition)
  await bean.init()
  await bean.preDestroy()
  t.pass()
})
