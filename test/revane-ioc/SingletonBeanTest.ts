import test from 'ava'
import SingletonBean from '../../src/revane-ioc/bean/SingletonBean.js'
import { DefaultBeanDefinition } from '../../src/revane-ioc/RevaneIOC.js'

test('should class postContruct on instance', async (t) => {
  const Clazz = await import('../../testdata/test6.js')
  const beanDefinition = new DefaultBeanDefinition('test')
  beanDefinition.classConstructor = Clazz.default as any
  beanDefinition.postConstructKey = 'postConstruct'
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const bean = new SingletonBean(beanDefinition, async () => {})
  await bean.init()
  await bean.postConstruct()

  const instance = await bean.getInstance()
  t.truthy(instance.postConstructed)
})

test('should return Promise on preDestroy()', async (t) => {
  const Clazz = await import('../../testdata/test6.js')

  const beanDefinition = new DefaultBeanDefinition('test')
  beanDefinition.classConstructor = Clazz.default as any
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const bean = new SingletonBean(beanDefinition, async () => {})
  await bean.init()
  await bean.preDestroy()
  t.pass()
})
