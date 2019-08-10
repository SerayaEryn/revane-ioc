import * as test from 'tape-catch'
import Container from '../../src/revane-ioc-core/context/Container'
import { BeanDefinition } from '../../src/revane-ioc/RevaneIOC'
import DefaultBeanTypeRegistry from '../../src/revane-ioc-core/context/DefaultBeanTypeRegistry'
import SingletonBean from '../../src/revane-ioc/bean/SingletonBean'

test('should execute initialize plugin', async (t) => {
  t.plan(2)
  let beanProvider1
  const options = {
    plugins: {
      initialize (beanProvider) {
        beanProvider1 = beanProvider
        t.pass()
      }
    },
    basePackage: __dirname
  }
  const registry = new DefaultBeanTypeRegistry()
  registry.register(SingletonBean)
  const beanDefinition = new BeanDefinition('test')
  beanDefinition.instance = { works: true }
  beanDefinition.scope = 'singleton'
  const container = new Container([ beanDefinition ], registry, options)
  await container.initialize()
  t.ok(beanProvider1.get('test'))
})

test('should use instance from beanDefinintion.instance', async (t) => {
  t.plan(1)

  const registry = new DefaultBeanTypeRegistry()
  registry.register(SingletonBean)
  const beanDefinition = new BeanDefinition('test')
  beanDefinition.instance = { works: true }
  beanDefinition.scope = 'singleton'
  const container = new Container([ beanDefinition ], registry, { basePackage: __dirname })
  await container.initialize()

  t.ok(container.get('test').works)
})
