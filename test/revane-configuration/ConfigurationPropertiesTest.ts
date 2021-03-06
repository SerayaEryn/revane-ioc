import * as path from 'path'
import test from 'ava'
import Revane from '../../src/revane-ioc/RevaneIOC'
import { RevaneConfiguration } from '../../src/revane-configuration/RevaneConfiguration'

test('should add configuration properties', async (t) => {
  t.plan(4)

  const options = {
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/configurationProperties') }
    ],
    basePackage: path.join(__dirname, '../../../testdata/configurationProperties'),
    componentScan: false,
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationProperties/testconfig') },
    profile: 'test'
  }
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

  const options = {
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/configurationProperties2') }
    ],
    basePackage: path.join(__dirname, '../../../testdata/configurationProperties2'),
    componentScan: false,
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationProperties2/testconfig') },
    profile: 'test'
  }
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
  const options = {
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/configurationProperties2') }
    ],
    basePackage: path.join(__dirname, '../../../testdata/configurationProperties2'),
    componentScan: false,
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationProperties2/testconfig') }
  }
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

  const options = {
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/configurationProperties3') }
    ],
    basePackage: path.join(__dirname, '../../../testdata/configurationProperties3'),
    componentScan: false,
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationProperties3/testconfig') },
    profile: 'test'
  }
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

  const options = {
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/configurationPropertiesYml1') }
    ],
    basePackage: path.join(__dirname, '../../../testdata/configurationPropertiesYml1'),
    componentScan: false,
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationPropertiesYml1/testconfig') },
    profile: 'test'
  }
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

  const options = {
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/configurationPropertiesYml2') }
    ],
    basePackage: path.join(__dirname, '../../../testdata/configurationPropertiesYml2'),
    componentScan: false,
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationPropertiesYml2/testconfig') },
    profile: 'test'
  }
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
  const options = {
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/configurationPropertiesYml3') }
    ],
    basePackage: path.join(__dirname, '../../../testdata/configurationPropertiesYml3'),
    componentScan: false,
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationPropertiesYml3/testconfig') },
    profile: 'test'
  }
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

  const options = {
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/configurationPropertiesProperties1') }
    ],
    basePackage: path.join(__dirname, '../../../testdata/configurationPropertiesProperties1'),
    componentScan: false,
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationPropertiesProperties1/testconfig') },
    profile: 'test'
  }
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

  const options = {
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/configurationPropertiesProperties2') }
    ],
    basePackage: path.join(__dirname, '../../../testdata/configurationPropertiesProperties2'),
    componentScan: false,
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationPropertiesProperties2/testconfig') },
    profile: 'test'
  }
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
  const options = {
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../../testdata/configurationPropertiesProperties3') }
    ],
    basePackage: path.join(__dirname, '../../../testdata/configurationPropertiesProperties3'),
    componentScan: false,
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/configurationPropertiesProperties3/testconfig') },
    profile: 'test'
  }
  const revane = new Revane(options)
  await revane.initialize()

  const configuration: RevaneConfiguration = await revane.get('configuration')
  t.is(configuration.getString('test.property1'), 'hello world')
  t.is(configuration.getString('test.property2'), 'a env var')
  const configurationProperties = await revane.get('scan56')
  t.is(configurationProperties.property1, 'hello world')
  t.is(configurationProperties.property2, 'a env var')
})
