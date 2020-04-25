import * as test from 'tape-catch'
import BeanDefinition from '../../src/revane-ioc-core/BeanDefinition'
import Context from '../../src/revane-ioc-core/context/Context'
import DefaultBeanTypeRegistry from '../../src/revane-ioc-core/context/DefaultBeanTypeRegistry'
import Bean from '../../src/revane-ioc-core/context/bean/Bean'

class MockedBean implements Bean {
  public static scope: string = 'mocked'
  private instance: any
  public type: string

  constructor (Clazz, entry, isClass, dependencies) {
    if (this.isClass(Clazz)) {
      this.instance = new Clazz(...(dependencies.dependencies || []))
    } else {
      this.instance = Clazz
    }
  }

  init (): Promise<void> {
    return Promise.resolve()
  }

  getInstance (): any {
    return this.instance
  }

  postConstruct (): Promise<any> {
    return Promise.resolve()
  }

  preDestroy (): Promise<any> {
    return Promise.resolve()
  }

  private isClass (Clazz: any): boolean {
    try {
      Object.defineProperty(Clazz, 'prototype', {
        writable: true
      })
      return false
    } catch (err) {
      return typeof Clazz === 'function'
    }
  }
}

class ErrorBean extends MockedBean {
  public static scope: string = 'error'

  postConstruct (): Promise<any> {
    return Promise.reject(new Error())
  }
}

const beanTypeRegistry = new DefaultBeanTypeRegistry()
beanTypeRegistry.register(MockedBean)
beanTypeRegistry.register(ErrorBean)

test('should register bean (class)', async (t) => {
  t.plan(1)

  const beanDefinition1 = new BeanDefinition('test1')
  beanDefinition1.class = '../../../testdata/test1'
  beanDefinition1.scope = 'mocked'
  const beanDefinitions = [
    beanDefinition1
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = context.get('test1')

  t.ok(bean)
})

test('should true if has bean', async (t) => {
  t.plan(1)

  const beanDefinition1 = new BeanDefinition('test1')
  beanDefinition1.class = '../../../testdata/test1'
  beanDefinition1.scope = 'mocked'
  const beanDefinitions = [
    beanDefinition1
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)

  const has = context.hasBeanDefinintion('test1')

  t.equals(has, true)
})

test('should false if does not has bean', async (t) => {
  t.plan(1)

  const beanDefinition1 = new BeanDefinition('test1')
  beanDefinition1.class = '../../../testdata/test1'
  beanDefinition1.scope = 'mocked'
  const beanDefinitions = [
    beanDefinition1
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)

  const has = context.hasBeanDefinintion('test2')

  t.equals(has, false)
})

test('should register bean (object)', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test3')
  beanDefinition1.class = '../../../testdata/test3'
  beanDefinition1.scope = 'mocked'
  const beanDefinitions = [
    beanDefinition1
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = await context.get('test3')

  t.ok(bean)
  t.strictEqual(bean.test, 'test3')
})

test('Should pass dependencies to constructor', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test1')
  beanDefinition1.class = '../../../testdata/test1'
  beanDefinition1.scope = 'mocked'
  const beanDefinition2 = new BeanDefinition('test2')
  beanDefinition2.class = '../../../testdata/test2'
  beanDefinition2.scope = 'mocked'
  beanDefinition2.properties = [{ ref: 'test1' }]
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]
  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = await context.get('test2')

  t.ok(bean)
  t.ok(bean.test1)
})

test('Should ignore order of bean definition', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test1')
  beanDefinition1.class = '../../../testdata/test1'
  beanDefinition1.scope = 'mocked'
  const beanDefinition2 = new BeanDefinition('test2')
  beanDefinition2.class = '../../../testdata/test2'
  beanDefinition2.scope = 'mocked'
  beanDefinition2.properties = [{ value: 'test1' }]
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]
  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = await context.get('test2')

  t.ok(bean)
  t.deepEquals(bean.test1, { type: 'value', value: 'test1' })
})

test('Should provide dependency to class', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test2')
  beanDefinition1.class = '../../../testdata/test2'
  beanDefinition1.scope = 'mocked'
  beanDefinition1.properties = [{ value: 'test1' }]
  const beanDefinition2 = new BeanDefinition('test1')
  beanDefinition2.class = '../../../testdata/test1'
  beanDefinition2.scope = 'mocked'
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]
  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = await context.get('test2')

  t.ok(bean)
  t.ok(bean.test1)
})

test('Should handle load after', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test2')
  beanDefinition1.class = '../../../testdata/test2'
  beanDefinition1.scope = 'mocked'
  beanDefinition1.properties = [{ value: 'test1' }]
  beanDefinition1.loadAfter = [ { ref: 'test1' } ]
  const beanDefinition2 = new BeanDefinition('test1')
  beanDefinition2.class = '../../../testdata/test1'
  beanDefinition2.scope = 'mocked'
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]
  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  const bean = await context.get('test2')

  t.ok(bean)
  t.ok(bean.test1)
})

test('disallow duplicate definition', (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test1')
  beanDefinition1.class = '../../../testdata/test1'
  beanDefinition1.scope = 'mocked'
  const beanDefinition2 = new BeanDefinition('test1')
  beanDefinition2.class = '../../../testdata/test1'
  beanDefinition2.scope = 'mocked'
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]
  const options = {
    basePackage: __dirname,
    noRedefinition: true
  }
  const context = new Context(options, beanTypeRegistry, new Map())

  try {
    context.addBeanDefinitions(beanDefinitions)
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_DEFINED_TWICE')
  }
})

test('disallow unknown scope', async (t) => {
  t.plan(2)

  const beanDefinition1 = new BeanDefinition('test1')
  beanDefinition1.class = '../../../testdata/test1'
  beanDefinition1.scope = 'request'
  const beanDefinitions = [
    beanDefinition1
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)

  try {
    await context.initialize()
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_INVALID_SCOPE')
  }
})

test('initialize should fail on error', async (t) => {
  t.plan(1)

  const beanDefinition1 = new BeanDefinition('test5')
  beanDefinition1.class = '../../../testdata/test5'
  beanDefinition1.scope = 'mocked'
  const beanDefinition2 = new BeanDefinition('test2')
  beanDefinition2.class = '../../../testdata/test2'
  beanDefinition2.scope = 'mocked'
  beanDefinition2.properties = [{
    ref: 'test5'
  }]
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)
  try {
    await context.initialize()
  } catch (err) {
    t.ok(err)
  }
})

test('throw error if get on uninitialized context', async (t) => {
  t.plan(2)

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())

  try {
    await context.get('test2')
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_CONTEXT_NOT_INITIALIZED')
  }
})

test('throw error if has on uninitialized context', async (t) => {
  t.plan(2)

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())

  try {
    await context.has('test2')
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_CONTEXT_NOT_INITIALIZED')
  }
})

test('throw error if getByType on uninitialized context', async (t) => {
  t.plan(2)

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())

  try {
    await context.getByType('test')
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_CONTEXT_NOT_INITIALIZED')
  }
})

test('throw error if getMultiple on uninitialized context', async (t) => {
  t.plan(2)

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())

  try {
    await context.getMultiple(['test2'])
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_CONTEXT_NOT_INITIALIZED')
  }
})

test('should throw error if error on post construct', async (t) => {
  t.plan(3)

  const beanDefinition1 = new BeanDefinition('test11')
  beanDefinition1.class = '../../../testdata/test11'
  beanDefinition1.scope = 'error'
  beanDefinition1.properties = [{
    ref: 'test10'
  }]
  const beanDefinition2 = new BeanDefinition('test10')
  beanDefinition2.class = '../../../testdata/test10'
  beanDefinition2.scope = 'mocked'
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)

  try {
    await context.initialize()
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_DEPENDENCY_REGISTER')
    t.ok(err.stack.includes('Caused by'))
  }
})

test('should throw error if error on creation', async (t) => {
  t.plan(3)

  const beanDefinition1 = new BeanDefinition('test11')
  beanDefinition1.class = '../../../testdata/test11'
  beanDefinition1.scope = 'mocked'
  beanDefinition1.properties = [{
    ref: 'test5'
  }]
  const beanDefinition2 = new BeanDefinition('test5')
  beanDefinition2.class = '../../../testdata/test5'
  beanDefinition2.scope = 'mocked'
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)

  try {
    await context.initialize()
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_DEPENDENCY_REGISTER')
    t.ok(err.stack.includes('Caused by'))
  }
})

test('should throw error if not found', async (t) => {
  t.plan(2)

  const beanDefinitions = []

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  try {
    await context.get('test')
  } catch (err) {
    t.ok(err)
    t.strictEqual(err.code, 'REV_ERR_NOT_FOUND')
  }
})

test('should handle on has()', async (t) => {
  t.plan(3)

  const beanDefinition1 = new BeanDefinition('test1')
  beanDefinition1.class = '../../../testdata/test1'
  beanDefinition1.scope = 'mocked'
  const beanDefinition2 = new BeanDefinition('test2')
  beanDefinition2.class = '../../../testdata/test2'
  beanDefinition2.scope = 'mocked'
  beanDefinition2.properties = [{
    ref: 'test1'
  }]
  const beanDefinitions = [
    beanDefinition1,
    beanDefinition2
  ]

  const options = {
    basePackage: __dirname
  }
  const context = new Context(options, beanTypeRegistry, new Map())
  context.addBeanDefinitions(beanDefinitions)
  await context.initialize()

  t.ok(await context.has('test2'))
  t.ok(await context.has('test1'))
  t.notOk(await context.has('unknown'))
})
