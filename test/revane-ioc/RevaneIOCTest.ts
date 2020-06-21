import * as path from 'path'
import test from 'ava'
import Revane, { LoaderOptions, BeanDefinition } from '../../src/revane-ioc/RevaneIOC'
import Loader from '../../src/revane-ioc-core/Loader'
import DefaultBeanDefinition from '../../src/revane-ioc-core/DefaultBeanDefinition'

test('should read json configuration file and register beans', async (t) => {
  t.plan(3)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    componentScan: false,
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') }
    ],
    configuration: { disabled: true },
    profile: 'test',
    scheduling: {
      enabled: false
    }
  }
  const revane = new Revane(options)
  await revane.initialize()
  const bean1 = await revane.get('json1')
  const bean2 = await revane.get('json2')

  t.truthy(bean1)
  t.truthy(bean2)
  t.truthy(bean2.json1)
})

test('should use auto configuration', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../testdata/autoConfig'),
    profile: 'test',
    autoConfiguration: true
  }
  const revane = new Revane(options)
  await revane.initialize()
  const configuration = await revane.get('configuration')
  await revane.get('taskScheduler')
  await revane.get('test')
  t.true(configuration.get('test'))
})

test('should throw error on unknown id', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    componentScan: false,
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  await t.throwsAsync(async () => {
    await revane.get('blub')
  }, { code: 'REV_ERR_NOT_FOUND' })
})

test('should throw error if not initialized #1', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    componentScan: false,
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  try {
    await revane.get('blub')
  } catch (err) {
    t.is(err.code, 'REV_ERR_NOT_INITIALIZED')
  }
})

test('should throw error if not initialized #2', async (t) => {
  t.plan(1)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    componentScan: false,
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  try {
    await revane.getByType('controller')
  } catch (err) {
    t.is(err.code, 'REV_ERR_NOT_INITIALIZED')
  }
})

test('should throw error if not initialized #3', async (t) => {
  t.plan(1)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    componentScan: false,
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  try {
    await revane.getMultiple(['test6'])
  } catch (err) {
    t.is(err.code, 'REV_ERR_NOT_INITIALIZED')
  }
})

test('should use parent context', async (t) => {
  t.plan(5)

  const options1 = {
    basePackage: path.join(__dirname, '../../../testdata'),
    componentScan: false,
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane1 = new Revane(options1)

  const options2 = {
    basePackage: path.join(__dirname, '../../../testdata'),
    componentScan: false,
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config4.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane2 = new Revane(options2)
  await revane1.initialize()
  await revane2.initialize()
  revane1.setParent(revane2)
  const bean1 = await revane1.get('json1')
  const bean2 = await revane1.get('json2')

  t.truthy(bean1)
  t.truthy(bean2)
  t.truthy(bean2.json1)
  const bean6 = await revane1.get('test6')
  const bean12 = await revane1.get('test12')
  t.truthy(bean6)
  t.truthy(bean12)
})

test('should use loader from Plugin', async (t) => {
  class FakeLoader implements Loader {
    type (): string {
      return 'json'
    }

    isRelevant (options: LoaderOptions): boolean {
      return true
    }

    async load (): Promise<DefaultBeanDefinition[]> {
      throw new Error('Method not implemented.')
    }
  }

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    componentScan: false,
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') }
    ],
    plugins: {
      loaders: [new FakeLoader()]
    },
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  return await revane.initialize()
    .catch((error) => {
      t.is(error.message, 'Method not implemented.')
    })
})

test('should read json configuration file and register beans #2', async (t) => {
  t.plan(4)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config3.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  const bean1 = await revane.get('json1')
  const bean2 = await revane.get('json2')
  const bean3 = await revane.get('json3')

  t.truthy(bean1)
  t.truthy(bean2)
  t.truthy(bean2.json1)
  t.truthy(bean3)
})

test('should handle has()', async (t) => {
  t.plan(4)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config3.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()

  t.truthy(await revane.has('json1'))
  t.truthy(await revane.has('json2'))
  t.truthy(await revane.has('json3'))
  t.truthy(!await revane.has('test'))
})

test('should read json and xml configuration file and register beans', async (t) => {
  t.plan(6)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') },
      { file: path.join(__dirname, '../../../testdata/xml/config.xml') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  const bean1 = await revane.get('json1')
  const bean2 = await revane.get('json2')
  const bean3 = await revane.get('xml1')
  const bean4 = await revane.get('xml2')

  t.truthy(bean1)
  t.truthy(bean2)
  t.is(bean2.json1, bean1)
  t.truthy(bean3)
  t.truthy(bean4)
  t.truthy(bean4.xml1)
})

test('should create bean for module', async (t) => {
  t.plan(1)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/xml/config3.xml') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  const bean = await revane.get('http')
  t.truthy(bean)
})

test('should create bean for module with value', async (t) => {
  t.plan(3)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/xml/config4.xml') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()

  const bean = await revane.get('xml2')
  const bean2 = await revane.get('xml3')
  t.truthy(bean)
  t.truthy(bean2)
  t.is(bean.xml1, 'xml1')
})

test('should tearDown', async (t) => {
  t.plan(1)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/xml/config4.xml') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  const bean = await revane.get('xml2')
  await revane.close()
  t.truthy(bean.destroyed)
})

test('should read not reject on missing paths', async (t) => {
  t.plan(1)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  return await revane.initialize()
    .then(() => {
      t.pass()
    })
})

test('should read json config file and reject on missing dependency', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config2.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  return await revane.initialize()
    .catch((err) => {
      t.truthy(err)
      t.is(err.code, 'REV_ERR_DEPENDENCY_NOT_FOUND')
    })
})

test('should reject error on unknown configuration file ending', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config2.test') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  return await revane.initialize()
    .catch((err) => {
      t.truthy(err)
      t.is(err.code, 'REV_ERR_UNKNOWN_ENDING')
    })
})

test('should not reject on custom file ending from loader', async (t) => {
  class TestLoader implements Loader {
    static type = 'test'

    type (): string {
      return 'test'
    }

    isRelevant (options: LoaderOptions): boolean {
      return options.file?.endsWith('test')
    }

    async load (): Promise<BeanDefinition[]> {
      return []
    }
  }

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config2.test') }
    ],
    plugins: { loaders: [new TestLoader()] },
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  return await revane.initialize()
    .then(() => {
      t.pass()
    })
})

test('should throw error on get() if not initialized', async (t) => {
  t.plan(2)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  try {
    await revane.get('test')
  } catch (err) {
    t.truthy(err)
    t.is(err.code, 'REV_ERR_NOT_INITIALIZED')
  }
})

test('should throw error on has() if not initialized', async (t) => {
  t.plan(2)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  try {
    await revane.has('test')
  } catch (err) {
    t.truthy(err)
    t.is(err.code, 'REV_ERR_NOT_INITIALIZED')
  }
})

test('should throw error on getMultiple if not initialized', async (t) => {
  t.plan(2)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') }
    ],
    componentScan: false,
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  try {
    await revane.getMultiple(['test'])
  } catch (err) {
    t.truthy(err)
    t.is(err.code, 'REV_ERR_NOT_INITIALIZED')
  }
})

test('should throw error on invalid scope', async (t) => {
  t.plan(2)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/invalidScope') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  try {
    await revane.initialize()
  } catch (err) {
    t.truthy(err)
    t.is(err.code, 'REV_ERR_INVALID_SCOPE')
  }
})

test('should throw error if dependency throws error', async (t) => {
  t.plan(2)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/dependencyError') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  try {
    await revane.initialize()
  } catch (err) {
    t.truthy(err)
    t.is(err.code, 'REV_ERR_DEPENDENCY_REGISTER')
  }
})

test('should throw error if bean was defined twice', async (t) => {
  t.plan(2)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/definedTwice') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  try {
    await revane.initialize()
  } catch (err) {
    t.truthy(err)
    t.is(err.code, 'REV_ERR_DEFINED_TWICE')
  }
})

test('should not throw error if bean redefinition is allowed', async (t) => {
  t.plan(1)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata/definedTwice2'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/definedTwice2') }
    ],
    configuration: { disabled: false },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  t.truthy(await revane.has('scan1'))
})

test('should not create conditional bean if not missing', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../testdata/conditionalOnMissingBean1'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../testdata/conditionalOnMissingBean1') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  t.truthy(await revane.has('conditionalOnMissingBean'))
})

test('should create conditional bean if missing', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../testdata/conditionalOnMissingBean2'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../testdata/conditionalOnMissingBean2') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  t.truthy(await revane.has('conditionalOnMissingBean'))
})

test('should return multiple beans', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  const [json1, json2] = await revane.getMultiple(['json1', 'json2'])
  t.truthy(json1)
  t.truthy(json2)
})

test('should throw error on getByType if not initialized', async (t) => {
  t.plan(2)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  try {
    await revane.getByType('test')
  } catch (err) {
    t.truthy(err)
    t.is(err.code, 'REV_ERR_NOT_INITIALIZED')
  }
})

test('should read json config file, component scan and register beans', async (t) => {
  t.plan(4)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') },
      { file: path.join(__dirname, '../../../testdata/xml/config2.xml') },
      { componentScan: true, basePackage: path.join(__dirname, '../../testdata/scan') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  const bean1 = await revane.get('json1')
  const bean2 = await revane.get('json2')
  const bean3 = await revane.get('scan1')

  t.truthy(bean1)
  t.truthy(bean2)
  t.truthy(bean2.json1)
  t.truthy(bean3)
})

test('component scan should handle file without bean', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../testdata/scan2') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  t.pass()
})

test('should read json config file, component scan and register beans #2', async (t) => {
  const options = {
    loaderOptions: [
      {
        file: path.join(__dirname, '../../../testdata/json/config.json')
      },
      {
        file: path.join(__dirname, '../../../testdata/xml/config2.xml')
      },
      {
        componentScan: true,
        basePackage: path.join(__dirname, '../../testdata/scan')
      }
    ],
    basePackage: path.join(__dirname, '../../../testdata'),
    componentScan: false,
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  const bean1 = await revane.get('json1')
  const bean2 = await revane.get('json2')
  const bean3 = await revane.get('scan1')

  t.truthy(bean1)
  t.truthy(bean2)
  t.truthy(bean2.json1)
  t.truthy(bean3)
})

test('should get components', async (t) => {
  t.plan(6)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') },
      { file: path.join(__dirname, '../../../testdata/xml/config2.xml') },
      { componentScan: true, basePackage: path.join(__dirname, '../../testdata/scan') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  const beans = await revane.getByType('component')

  t.truthy(beans[0].postConstructed)
  t.truthy(beans[1].test6)
  t.truthy(beans[2].test6)
  t.truthy(beans[3].arg)
  t.truthy(beans[4])
  t.is(5, beans.length)
})
