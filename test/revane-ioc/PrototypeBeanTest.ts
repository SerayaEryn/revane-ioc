import test from 'ava'
import PrototypeBean from '../../src/revane-ioc/bean/PrototypeBean'
import { DefaultBeanDefinition } from '../../src/revane-ioc/RevaneIOC'

test('should class postConstruct on instance', async (t) => {
  t.plan(1)

  const Clazz = await import('../../testdata/test6')

  const beanDefinition = new DefaultBeanDefinition('test')
  beanDefinition.classConstructor = Clazz.default
  beanDefinition.postConstructKey = 'postConstruct'
  const bean = new PrototypeBean(beanDefinition, async () => {})

  const instance = await bean.getInstance()
  t.truthy(instance.postConstructed)
})

test('should handle missing postConstruct on instance', async (t) => {
  t.plan(1)

  const Clazz = await import('../../testdata/test1')

  const beanDefinition = new DefaultBeanDefinition('test')
  beanDefinition.classConstructor = Clazz.default
  beanDefinition.postConstructKey = null
  const bean = new PrototypeBean(beanDefinition, async () => {})

  t.truthy(await bean.getInstance())
})

test('should return Promise on preDestroy()', async (t) => {
  t.plan(1)

  const Clazz = await import('../../testdata/test6')

  const beanDefinition = new DefaultBeanDefinition('test')
  beanDefinition.classConstructor = Clazz.default
  beanDefinition.preDestroyKey = 'preDestroy'
  const bean = new PrototypeBean(beanDefinition, async () => {})

  await bean.preDestroy()

  t.pass()
})

test('should return Promise on postConstruct()', async (t) => {
  const Clazz = await import('../../testdata/test6')

  const beanDefinition = new DefaultBeanDefinition('test')
  beanDefinition.classConstructor = Clazz as any
  beanDefinition.postConstructKey = 'postConstruct'
  const bean = new PrototypeBean(beanDefinition, async () => {})

  await bean.postConstruct()

  t.pass()
})
