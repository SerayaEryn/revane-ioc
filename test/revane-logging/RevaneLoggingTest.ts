import * as path from 'path'
import test from 'ava'
import RevaneIoc from '../../src/revane-ioc/RevaneIOC'
import { LogFactory } from '../../src/revane-logging/RevaneLogging'
import { LoggingLoader } from '../../src/revane-logging/LoggingLoader'

test('should disable logging', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../../testdata/logging1'),
    componentScan: false,
    loaderOptions: [],
    configuration: { disabled: false },
    profile: 'test',
    scheduling: {
      enabled: false
    }
  }
  const revane = new RevaneIoc(options)
  await revane.initialize()

  t.false(await revane.has('logFactory'))
})

test('should log to file', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../../testdata/logging2'),
    componentScan: false,
    loaderOptions: [],
    configuration: { disabled: false },
    profile: 'test',
    scheduling: {
      enabled: false
    }
  }
  const revane = new RevaneIoc(options)
  await revane.initialize()

  t.true(await revane.has('logFactory'))
})

test('should log to file if a path was given', async (t) => {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  class Test {}
  const options = {
    basePackage: path.join(__dirname, '../../../testdata/logging3'),
    componentScan: false,
    loaderOptions: [],
    configuration: { disabled: false },
    profile: 'test',
    scheduling: {
      enabled: false
    }
  }
  const revane = new RevaneIoc(options)
  await revane.initialize()

  t.true(await revane.has('logFactory'))
  const logFactory: LogFactory = await revane.get('logFactory')
  const logger = logFactory.getInstance(Test)
  t.truthy(logger)
  t.is(logger.getLevel(), 'INFO')
})

test('should use rootLevel', async (t) => {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  class Test {}
  const options = {
    basePackage: path.join(__dirname, '../../../testdata/logging4'),
    componentScan: false,
    loaderOptions: [],
    configuration: { disabled: false },
    profile: 'test',
    scheduling: {
      enabled: false
    }
  }
  const revane = new RevaneIoc(options)
  await revane.initialize()

  t.true(await revane.has('logFactory'))
  const logFactory: LogFactory = await revane.get('logFactory')
  const logger = logFactory.getInstance(Test)
  t.truthy(logger)
  t.is(logger.getLevel(), 'WARN')
})

test('should use level for class', async (t) => {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  class Test {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor () {}
  }
  const options = {
    basePackage: path.join(__dirname, '../../../testdata/logging5'),
    componentScan: false,
    loaderOptions: [],
    configuration: { disabled: false },
    profile: 'test',
    scheduling: {
      enabled: false
    }
  }
  const revane = new RevaneIoc(options)
  await revane.initialize()

  t.true(await revane.has('logFactory'))
  const logFactory: LogFactory = await revane.get('logFactory')
  const logger = logFactory.getInstance(Test)
  t.truthy(logger)
  t.is(logger.getLevel(), 'DEBUG')
})

test('loader should return correct type', (t) => {
  const loader = new LoggingLoader({} as any)
  t.is(loader.type(), 'logging')
})
