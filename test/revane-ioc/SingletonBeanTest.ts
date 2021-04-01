import test from 'ava'
import SingletonBean from '../../src/revane-ioc/bean/SingletonBean'
import { BeanDefinition } from '../../src/revane-ioc/RevaneIOC'

test('should class postContruct on instance', async (t) => {
  const Clazz = await import('../../testdata/test6')

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz.default
  beanDefinition.postConstructKey = 'postConstruct'
  const bean = new SingletonBean(beanDefinition, async () => {})
  await bean.init()
  await bean.postConstruct()

  const instance = await bean.getInstance()
  t.truthy(instance.postConstructed)
})

test('should return Promise on preDestroy()', async (t) => {
  const Clazz = await import('../../testdata/test6')

  const beanDefinition = new BeanDefinition('test')
  beanDefinition.classConstructor = Clazz.default
  const bean = new SingletonBean(beanDefinition, async () => {})
  await bean.init()
  await bean.preDestroy()
  t.pass()
})
