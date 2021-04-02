import { join } from 'path'
import test from 'ava'
import Revane, { Options } from '../../src/revane-ioc/RevaneIOC'
import { JsonFileLoaderOptions } from '../../src/revane-ioc/loaders/JsonFileLoaderOptions'
import { XmlFileLoaderOptions } from '../../src/revane-ioc/loaders/XmlFileLoaderOptions'
import { ComponentScanLoaderOptions } from '../../src/revane-ioc/loaders/ComponentScanLoaderOptions'

test('should read json configuration file and register beans', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  options.noRedefinition = true
  const revane = new Revane(options)
  await revane.initialize()
  const bean1 = await revane.get('json1')
  const bean2 = await revane.get('json2')

  t.truthy(bean1)
  t.truthy(bean2)
  t.truthy(bean2.json1)
})

test('should use auto configuration', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata/autoConfig'),
    []
  )
  options.profile = 'test'
  options.autoConfiguration = true
  const revane = new Revane(options)
  await revane.initialize()
  const configuration = await revane.get('configuration')
  await revane.get('test')
  t.true(configuration.get('test'))
})

test('should throw error on unknown id', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()
  await t.throwsAsync(async () => {
    await revane.get('blub')
  }, { code: 'REV_ERR_NOT_FOUND' })
})

test('should throw error if not initialized #1', async (t) => {
  const options = new Options(
    join(__dirname, '../../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  try {
    await revane.get('blub')
  } catch (err) {
    t.is(err.code, 'REV_ERR_NOT_INITIALIZED')
  }
})

test('should throw error if not initialized #2', async (t) => {
  const options = new Options(
    join(__dirname, '../../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  try {
    await revane.getByType('controller')
  } catch (err) {
    t.is(err.code, 'REV_ERR_NOT_INITIALIZED')
  }
})

test('should throw error if not initialized #3', async (t) => {
  const options = new Options(
    join(__dirname, '../../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  try {
    await revane.getMultiple(['test6'])
  } catch (err) {
    t.is(err.code, 'REV_ERR_NOT_INITIALIZED')
  }
})

test('should use parent context', async (t) => {
  const options1 = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options1.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json'))
  ]
  options1.configuration = { disabled: true }
  options1.profile = 'test'
  const revane1 = new Revane(options1)

  const options2 = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options2.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config4.json'))
  ]
  options2.configuration = { disabled: true }
  options2.profile = 'test'
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

test('should read json configuration file and register beans #2', async (t) => {
  t.plan(4)

  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config3.json'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
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

test('should return if beans exist()', async (t) => {
  t.plan(4)

  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config3.json'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()

  t.truthy(await revane.has('json1'))
  t.truthy(await revane.has('json2'))
  t.truthy(await revane.has('json3'))
  t.truthy(!await revane.has('test'))
})

test('should read json and xml configuration file and register beans', async (t) => {
  t.plan(6)

  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json')),
    new XmlFileLoaderOptions(join(__dirname, '../../../testdata/xml/config.xml'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
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
  const options = new Options(
    join(__dirname, '../../../testdata'),
    []
  )
  options.loaderOptions = [
    new XmlFileLoaderOptions(join(__dirname, '../../../testdata/xml/config3.xml'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()
  const bean = await revane.get('http')
  t.truthy(bean)
})

test('should create bean for module with value', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new XmlFileLoaderOptions(join(__dirname, '../../../testdata/xml/config4.xml'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()

  const bean = await revane.get('xml2')
  const bean2 = await revane.get('xml3')
  t.truthy(bean)
  t.truthy(bean2)
  t.is(bean.xml1, 'xml1')
})

test('should tearDown', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new XmlFileLoaderOptions(join(__dirname, '../../../testdata/xml/config4.xml'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()
  const bean = await revane.get('xml2')
  await revane.close()
  t.true(bean.destroyed)
})

test('should read not reject on missing paths', async (t): Promise<void> => {
  t.plan(1)

  const options = new Options(
    join(__dirname, '../../../testdata'),
    []
  )
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  return await revane.initialize()
    .then(() => {
      t.pass()
    })
})

test('should read json config file and reject on missing dependency', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config2.json'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  return await revane.initialize()
    .catch((err) => {
      t.truthy(err)
      t.is(err.code, 'REV_ERR_DEPENDENCY_NOT_FOUND')
    })
})

test('should reject error on unknown configuration file ending - json', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config2.test'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  return await revane.initialize()
    .catch((err) => {
      t.truthy(err)
      t.is(err.code, 'REV_ERR_UNKNOWN_ENDING')
    })
})

test('should reject error on unknown configuration file ending - xml', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new XmlFileLoaderOptions(
      join(__dirname, '../../../testdata/json/config2.test')
    )
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  return await revane.initialize()
    .catch((err) => {
      t.truthy(err)
      t.is(err.code, 'REV_ERR_UNKNOWN_ENDING')
    })
})

test('should throw error on get() if not initialized', async (t): Promise<void> => {
  t.plan(2)

  const options = new Options(
    join(__dirname, '../../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  try {
    await revane.get('test')
  } catch (err) {
    t.truthy(err)
    t.is(err.code, 'REV_ERR_NOT_INITIALIZED')
  }
})

test('should throw error on has() if not initialized', async (t): Promise<void> => {
  t.plan(2)

  const options = new Options(
    join(__dirname, '../../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
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

  const options = new Options(
    join(__dirname, '../../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
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

  const options = new Options(
    join(__dirname, '../../../testdata'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(join(__dirname, '../../../testdata/invalidScope'), null, null)
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
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

  const options = new Options(
    join(__dirname, '../../../testdata'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(join(__dirname, '../../../testdata/dependencyError'), null, null)
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
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

  const options = new Options(
    join(__dirname, '../../../testdata'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(join(__dirname, '../../../testdata/definedTwice'), null, null)
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  try {
    await revane.initialize()
  } catch (err) {
    t.truthy(err)
    t.is(err.code, 'REV_ERR_DEFINED_TWICE')
  }
})

test('should not throw error if bean redefinition is allowed', async (t) => {
  const options = new Options(
    join(__dirname, '../../../testdata/definedTwice2'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(join(__dirname, '../../../testdata/definedTwice2'), null, null)
  ]
  options.configuration = { disabled: false }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()
  t.truthy(await revane.has('scan1'))
})

test('should not create conditional bean if not missing', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata/conditionalOnMissingBean1'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(join(__dirname, '../../testdata/conditionalOnMissingBean1'), null, null)
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()
  t.truthy(await revane.has('conditionalOnMissingBean'))
})

test('should create conditional bean if missing', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata/conditionalOnMissingBean2'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(join(__dirname, '../../testdata/conditionalOnMissingBean2'), null, null)
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()
  t.truthy(await revane.has('conditionalOnMissingBean'))
})

test('should return multiple beans', async (t) => {
  const basePackage = join(__dirname, '../../testdata')
  const options = new Options(
    basePackage,
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()
  const [json1, json2] = await revane.getMultiple(['json1', 'json2'])
  t.truthy(json1)
  t.truthy(json2)
})

test('should throw error on getByType if not initialized', async (t) => {
  t.plan(2)

  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json'))
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
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

  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json')),
    new XmlFileLoaderOptions(join(__dirname, '../../../testdata/xml/config2.xml')),
    new ComponentScanLoaderOptions(join(__dirname, '../../testdata/scan'), null, null)
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
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
  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(join(__dirname, '../../testdata/scan2'), null, null)
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()
  t.pass()
})

test('should read json config file, component scan and register beans #2', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json')),
    new XmlFileLoaderOptions(join(__dirname, '../../../testdata/xml/config2.xml')),
    new ComponentScanLoaderOptions(join(__dirname, '../../testdata/scan'), null, null)
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
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
  const options = new Options(
    join(__dirname, '../../testdata'),
    []
  )
  options.loaderOptions = [
    new JsonFileLoaderOptions(join(__dirname, '../../../testdata/json/config.json')),
    new XmlFileLoaderOptions(join(__dirname, '../../../testdata/xml/config2.xml')),
    new ComponentScanLoaderOptions(join(__dirname, '../../testdata/scan'), null, null)
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()
  const beans = await revane.getByType('component')

  t.is(6, beans.length)
  t.truthy(beans[0].postConstructed)
  t.truthy(beans[1])
  t.truthy(beans[2].test6)
  t.truthy(beans[3].test6)
  t.truthy(beans[4].arg)
  t.truthy(beans[5])
})

test('should invoke lifecycle methods for bean with scope prototype', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata/lifecycle'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(join(__dirname, '../../testdata/lifecycle1'), null, null)
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()

  await revane.get('test')
  const bean = await revane.get('test')
  await revane.close()
  t.is(bean.getCallcount(), 4)
})

test('should not try to call no existant preDestroy hook', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata/lifecycle'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(join(__dirname, '../../testdata/lifecycle2'), null, null)
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()

  await revane.get('test')
  const bean = await revane.get('test')
  await revane.close()
  t.is(bean.getCallcount(), 2)
})
