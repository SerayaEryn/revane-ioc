import * as path from 'path'
import * as test from 'tape-catch'
import Revane, { LoaderOptions } from '../../src/revane-ioc/RevaneIOC'
import Loader from '../../src/revane-ioc-core/Loader'
import BeanDefinition from '../../src/revane-ioc-core/BeanDefinition'

test('should read json configuration file and register beans', async (t) => {
  t.plan(3)

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
  const bean1 = await revane.get('json1')
  const bean2 = await revane.get('json2')

  t.ok(bean1)
  t.ok(bean2)
  t.ok(bean2.json1)
})

test('should use loader from Plugin', (t) => {
  t.plan(1)

  class FakeLoader implements Loader {
    type (): string {
      return 'json'
    }
    isRelevant (options: LoaderOptions): boolean {
      return true
    }
    load (): Promise<BeanDefinition[]> {
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
      loaders: [ new FakeLoader() ]
    },
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  return revane.initialize()
    .catch((error) => {
      t.equals(error.message, 'Method not implemented.')
    })
})

test('should read json configuration file and register beans', async (t) => {
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

  t.ok(bean1)
  t.ok(bean2)
  t.ok(bean2.json1)
  t.ok(bean3)
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

  t.ok(await revane.has('json1'))
  t.ok(await revane.has('json2'))
  t.ok(await revane.has('json3'))
  t.ok(!await revane.has('test'))
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

  t.ok(bean1)
  t.ok(bean2)
  t.equals(bean2.json1, bean1)
  t.ok(bean3)
  t.ok(bean4)
  t.ok(bean4.xml1)
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
  t.ok(bean)
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
  t.ok(bean)
  t.ok(bean2)
  t.equals(bean.xml1, 'xml1')
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
  t.ok(bean.destroyed)
})

test('should read not reject on missing paths', (t) => {
  t.plan(1)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  return revane.initialize()
    .then(() => {
      t.pass()
    })
})

test('should read json config file and reject on missing dependency', (t) => {
  t.plan(2)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config2.json') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  return revane.initialize()
    .catch((err) => {
      t.ok(err)
      t.strictEquals(err.code, 'REV_ERR_DEPENDENCY_NOT_FOUND')
    })
})

test('should reject error on unknown configuration file ending', (t) => {
  t.plan(2)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config2.test') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  return revane.initialize()
    .catch((err) => {
      t.ok(err)
      t.strictEquals(err.code, 'REV_ERR_UNKNOWN_ENDING')
    })
})

test('should not reject on custom file ending from loader', (t) => {
  t.plan(1)
  class TestLoader implements Loader {
    type (): string {
      return 'test'
    }
    isRelevant (options: LoaderOptions): boolean {
      return options.file && options.file.endsWith('test')
    }
    static type = 'test'
    load () {
      return Promise.resolve([])
    }
  }

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config2.test') }
    ],
    plugins: { loaders: [ new TestLoader() ] },
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  return revane.initialize()
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
    t.ok(err)
    t.strictEquals(err.code, 'REV_ERR_NOT_INITIALIZED')
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
    t.ok(err)
    t.strictEquals(err.code, 'REV_ERR_NOT_INITIALIZED')
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
    t.ok(err)
    t.strictEquals(err.code, 'REV_ERR_NOT_INITIALIZED')
  }
})

test('should return multiple beans', async (t) => {
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
  await revane.initialize()
  const [ json1, json2 ] = await revane.getMultiple(['json1', 'json2'])
  t.ok(json1)
  t.ok(json2)
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
    t.ok(err)
    t.strictEquals(err.code, 'REV_ERR_NOT_INITIALIZED')
  }
})

test('should read json config file, component scan and register beans', async (t) => {
  t.plan(4)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') },
      { file: path.join(__dirname, '../../../testdata/xml/config2.xml') },
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  const bean1 = await revane.get('json1')
  const bean2 = await revane.get('json2')
  const bean3 = await revane.get('scan1')

  t.ok(bean1)
  t.ok(bean2)
  t.ok(bean2.json1)
  t.ok(bean3)
})

test('should read json config file, component scan and register beans', async (t) => {
  t.plan(4)

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
        basePackage: path.join(__dirname, '../../../testdata')
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

  t.ok(bean1)
  t.ok(bean2)
  t.ok(bean2.json1)
  t.ok(bean3)
})

test('should get components', async (t) => {
  t.plan(6)

  const options = {
    basePackage: path.join(__dirname, '../../../testdata'),
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/json/config.json') },
      { file: path.join(__dirname, '../../../testdata/xml/config2.xml') },
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata') }
    ],
    configuration: { disabled: true },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()
  const beans = await revane.getByType('component')

  t.ok(beans[0].postConstructed)
  t.ok(beans[1].test6)
  t.ok(beans[2].test6)
  t.ok(beans[3].arg)
  t.ok(beans[4])
  t.strictEquals(6, beans.length)
})
