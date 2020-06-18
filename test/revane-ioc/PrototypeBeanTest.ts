import test from 'ava'
import PrototypeBean from '../../src/revane-ioc/bean/PrototypeBean'
import { BeanDefinition } from '../../src/revane-ioc/RevaneIOC'

test('should class postConstruct on instance', async (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz
  const bean = new PrototypeBean(beanDefinition)

  const instance = await bean.getInstance()
  t.truthy(instance.postConstructed)
})

test('should handle missing postConstruct on instance', async (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test1')

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz
  const bean = new PrototypeBean(beanDefinition)

  t.truthy(await bean.getInstance())
})

test('should return Promise on preDestroy()', async (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz
  const bean = new PrototypeBean(beanDefinition)

  await bean.preDestroy()

  t.pass()
})

test('should return Promise on postConstruct()', async (t) => {
  const Clazz = require('../../../testdata/test6')

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz
  const bean = new PrototypeBean(beanDefinition)

  await bean.postConstruct()

  t.pass()
})
