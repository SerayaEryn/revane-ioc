import * as path from 'path'
import test from 'ava'
import RevaneIoc, { BeanFactoryExtension, ComponentScanExtension, ComponentScanLoaderOptions, LogFactory, LoggingExtension, Options } from '../../src/revane-ioc/RevaneIOC'
import { LoggingLoader } from '../../src/revane-logging/LoggingLoader'
import { join } from 'path'

test('should inject logger', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata'),
    [new ComponentScanExtension(), new LoggingExtension()]
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      join(__dirname, '../../testdata/logging6'),
      [],
      []
    )
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new RevaneIoc(options)
  await revane.initialize()

  const bean1 = await revane.get('test1')
  t.true(bean1.logger != null)
})

test('should disable logging', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../../testdata/logging1'),
    [new LoggingExtension()]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false }
  options.profile = 'test'
  const revane = new RevaneIoc(options)
  await revane.initialize()

  t.false(await revane.has('logFactory'))
})

test('should log to file', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../../testdata/logging2'),
    [new LoggingExtension()]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false }
  options.profile = 'test'
  const revane = new RevaneIoc(options)
  await revane.initialize()

  t.true(await revane.has('logFactory'))
})

test('should log to file if a path was given', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../../testdata/logging3'),
    [new LoggingExtension()]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false }
  options.profile = 'test'
  const revane = new RevaneIoc(options)
  await revane.initialize()

  t.true(await revane.has('logFactory'))
  const logFactory: LogFactory = await revane.get('logFactory')
  const logger = logFactory.getInstance('test')
  t.truthy(logger)
  t.is(logger.getLevel(), 'INFO')
})

test('should create logger bean', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../../testdata/logging3'),
    [
      new BeanFactoryExtension(),
      new LoggingExtension()
    ]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false }
  options.profile = 'test'
  const revane = new RevaneIoc(options)
  await revane.initialize()

  t.true(await revane.has('rootLogger'))
})

test('should use rootLevel', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../../testdata/logging4'),
    [new LoggingExtension()]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false }
  options.profile = 'test'
  const revane = new RevaneIoc(options)
  await revane.initialize()

  t.true(await revane.has('logFactory'))
  const logFactory: LogFactory = await revane.get('logFactory')
  const logger = logFactory.getInstance('test')
  t.truthy(logger)
  t.is(logger.getLevel(), 'WARN')
})

test('should use level for class', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../../testdata/logging5'),
    [new LoggingExtension()]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false }
  options.profile = 'test'
  const revane = new RevaneIoc(options)
  await revane.initialize()

  t.true(await revane.has('logFactory'))
  const logFactory: LogFactory = await revane.get('logFactory')
  const logger = logFactory.getInstance('test')
  t.truthy(logger)
  t.is(logger.getLevel(), 'DEBUG')
})

test('loader should return correct type', (t) => {
  const loader = new LoggingLoader({} as any)
  t.is(loader.type(), 'logging')
})
