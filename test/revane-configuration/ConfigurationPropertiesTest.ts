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
