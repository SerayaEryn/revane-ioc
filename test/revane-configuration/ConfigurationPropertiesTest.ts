import * as path from 'path'
import test from 'ava'
import Revane, { Options } from '../../src/revane-ioc/RevaneIOC'
import { RevaneConfiguration } from '../../src/revane-configuration/RevaneConfiguration'
import { ComponentScanLoaderOptions } from '../../src/revane-ioc/loaders/ComponentScanLoaderOptions'

test('should add configuration properties', async (t) => {
  t.plan(4)

  const options = new Options(
    path.join(__dirname, '../../../testdata/configurationProperties'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      path.join(__dirname, '../../../testdata/configurationProperties'), null, null
    )
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationProperties/testconfig') }
  options.profile = 'test'

  const revane = new Revane(options)
  await revane.initialize()

  const configuration: RevaneConfiguration = await revane.get('configuration')
  t.is(configuration.getString('test.property1'), 'hello world')
  t.is(configuration.getNumber('test.property2'), 43)
  const configurationProperties = await revane.get('scan5')
  t.is(configurationProperties.property1, 'hello world')
  t.is(configurationProperties.property2, 43)
})

test('should add configuration properties #2', async (t) => {
  t.plan(4)

  const options = new Options(
    path.join(__dirname, '../../../testdata/configurationProperties2'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      path.join(__dirname, '../../../testdata/configurationProperties2'), null, null
    )
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationProperties2/testconfig') }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()

  const configuration: RevaneConfiguration = await revane.get('configuration')
  t.is(configuration.getString('test.property1'), 'hello world')
  t.is(configuration.getNumber('test.property2'), 44)
  const configurationProperties = await revane.get('scan56')
  t.is(configurationProperties.property1, 'hello world')
  t.is(configurationProperties.property2, 44)
})

test('should add configuration properties and use REVANE_PROFILE=test', async (t) => {
  t.plan(4)

  process.env.REVANE_PROFILE = 'test'
  const options = new Options(
    path.join(__dirname, '../../../testdata/configurationProperties2'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      path.join(__dirname, '../../../testdata/configurationProperties2'), null, null
    )
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationProperties2/testconfig') }
  const revane = new Revane(options)
  await revane.initialize()

  const configuration: RevaneConfiguration = await revane.get('configuration')
  t.is(configuration.getString('test.property1'), 'hello world')
  t.is(configuration.getNumber('test.property2'), 44)
  const configurationProperties = await revane.get('scan56')
  t.is(configurationProperties.property1, 'hello world')
  t.is(configurationProperties.property2, 44)
})

test('should add configuration properties #3', async (t) => {
  t.plan(4)

  const options = new Options(
    path.join(__dirname, '../../../testdata/configurationProperties3'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      path.join(__dirname, '../../../testdata/configurationProperties3'), null, null
    )
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationProperties3/testconfig') }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()

  const configuration: RevaneConfiguration = await revane.get('configuration')
  t.is(configuration.getString('test.property1'), 'hello world')
  t.is(configuration.getNumber('test.property2'), 44)
  const configurationProperties = await revane.get('scan56')
  t.is(configurationProperties.property1, 'hello world')
  t.is(configurationProperties.property2, 44)
})

test('should add configuration properties from yaml #1', async (t) => {
  t.plan(4)

  const options = new Options(
    path.join(__dirname, '../../../testdata/configurationPropertiesYml1'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      path.join(__dirname, '../../../testdata/configurationPropertiesYml1'), null, null
    )
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationPropertiesYml1/testconfig') }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()

  const configuration: RevaneConfiguration = await revane.get('configuration')
  t.is(configuration.getString('test.property1'), 'hello world')
  t.is(configuration.getNumber('test.property2'), 44)
  const configurationProperties = await revane.get('scan56')
  t.is(configurationProperties.property1, 'hello world')
  t.is(configurationProperties.property2, 44)
})

test('should add configuration properties from yaml #2', async (t) => {
  t.plan(4)

  const options = new Options(
    path.join(__dirname, '../../../testdata/configurationPropertiesYml2'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      path.join(__dirname, '../../../testdata/configurationPropertiesYml2'), null, null
    )
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationPropertiesYml2/testconfig') }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()

  const configuration: RevaneConfiguration = await revane.get('configuration')
  t.is(configuration.getString('test.property1'), 'hello world')
  t.is(configuration.getNumber('test.property2'), 43)
  const configurationProperties = await revane.get('scan56')
  t.is(configurationProperties.property1, 'hello world')
  t.is(configurationProperties.property2, 43)
})

test('should add configuration properties from yaml and replace env vars', async (t) => {
  t.plan(4)

  process.env.A_ENV_VAR = 'a env var'
  const options = new Options(
    path.join(__dirname, '../../../testdata/configurationPropertiesYml3'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      path.join(__dirname, '../../../testdata/configurationPropertiesYml3'), null, null
    )
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationPropertiesYml3/testconfig') }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()

  const configuration: RevaneConfiguration = await revane.get('configuration')
  t.is(configuration.getString('test.property1'), 'hello world')
  t.is(configuration.getString('test.property2'), 'a env var')
  const configurationProperties = await revane.get('scan56')
  t.is(configurationProperties.property1, 'hello world')
  t.is(configurationProperties.property2, 'a env var')
})

test('should add configuration properties from properties #1', async (t) => {
  t.plan(6)

  const options = new Options(
    path.join(__dirname, '../../../testdata/configurationPropertiesProperties1'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      path.join(__dirname, '../../../testdata/configurationPropertiesProperties1'), null, null
    )
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationPropertiesProperties1/testconfig') }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()

  const configuration: RevaneConfiguration = await revane.get('configuration')
  t.is(configuration.getString('test.property1'), 'hello world')
  t.is(configuration.getNumber('test.property2'), 44)
  t.is(configuration.getBoolean('test.test2.property3'), false)
  t.is(configuration.getBoolean('test.test2.property4'), true)
  const configurationProperties = await revane.get('scan56')
  t.is(configurationProperties.property1, 'hello world')
  t.is(configurationProperties.property2, 44)
})

test('should add configuration properties from properties #2', async (t) => {
  t.plan(4)

  const options = new Options(
    path.join(__dirname, '../../../testdata/configurationPropertiesProperties2'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      path.join(__dirname, '../../../testdata/configurationPropertiesProperties2'), null, null
    )
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationPropertiesProperties2/testconfig') }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()

  const configuration: RevaneConfiguration = await revane.get('configuration')
  t.is(configuration.getString('test.property1'), 'hello world')
  t.is(configuration.getNumber('test.property2'), 43)
  const configurationProperties = await revane.get('scan56')
  t.is(configurationProperties.property1, 'hello world')
  t.is(configurationProperties.property2, 43)
})

test('should add configuration properties from properties and replace env vars', async (t) => {
  t.plan(4)

  process.env.A_ENV_VAR = 'a env var'
  const options = new Options(
    path.join(__dirname, '../../../testdata/configurationPropertiesProperties3'),
    []
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      path.join(__dirname, '../../../testdata/configurationPropertiesProperties3'), null, null
    )
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationPropertiesProperties3/testconfig') }
  options.profile = 'test'
  const revane = new Revane(options)
  await revane.initialize()

  const configuration: RevaneConfiguration = await revane.get('configuration')
  t.is(configuration.getString('test.property1'), 'hello world')
  t.is(configuration.getString('test.property2'), 'a env var')
  const configurationProperties = await revane.get('scan56')
  t.is(configurationProperties.property1, 'hello world')
  t.is(configurationProperties.property2, 'a env var')
})
