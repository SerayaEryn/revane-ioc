import * as test from 'tape-catch'
import PrototypeBean from '../../src/revane-ioc/bean/PrototypeBean'
import { BeanDefinition } from '../../src/revane-ioc/RevaneIOC'

test('should class postConstruct on instance', async (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz
  const bean = new PrototypeBean(beanDefinition)

  const instance = await bean.getInstance()
  t.ok(instance.postConstructed)
})

test('should handle missing postConstruct on instance', async (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test1')

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz
  const bean = new PrototypeBean(beanDefinition)

  t.ok(await bean.getInstance())
})

test('should return Promise on preDestroy()', (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz
  const bean = new PrototypeBean(beanDefinition)
  bean.preDestroy()
    .then(() => t.pass())
    .catch((err) => t.error(err))
})

test('should return Promise on postConstruct()', (t) => {
  t.plan(1)

  const Clazz = require('../../../testdata/test6')

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz
  const bean = new PrototypeBean(beanDefinition)
  bean.postConstruct()
    .then(() => t.pass())
    .catch((err) => t.error(err))
})
