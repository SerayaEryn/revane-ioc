import test from 'ava'
import * as path from 'path'
import { ComponentScanLoaderOptions } from '../../src/revane-ioc/loaders/ComponentScanLoaderOptions'
import RevaneIOC, { Options, SchedulingExtension } from '../../src/revane-ioc/RevaneIOC'
import { SchedulerLoader } from '../../src/revane-scheduler/SchedulerLoader'
import { TaskScheduler } from '../../src/revane-scheduler/TaskScheduler'

test('Should schedule task', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../testdata/scheduler'),
    [new SchedulingExtension(null)]
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(path.join(__dirname, '../../testdata/scheduler'), null, null)
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/scheduler/testconfig') }
  options.profile = 'test'
  const revane = new RevaneIOC(options)
  await revane.initialize()

  await wait()
  t.true((await revane.get('scan56')).executed)
  await revane.close()
})

test('Should schedule task enabled via extension options', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../testdata/scheduler2'),
    [new SchedulingExtension({ enabled: true })]
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(path.join(__dirname, '../../testdata/scheduler2'), null, null)
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/scheduler2/testconfig') }
  options.profile = 'test'
  const revane = new RevaneIOC(options)
  await revane.initialize()

  await wait()
  t.true((await revane.get('scan56')).executed)
  await revane.close()
})

test('Should schedule task #2', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../testdata/scheduler-invalid1'),
    [new SchedulingExtension(null)]
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(path.join(__dirname, '../../testdata/scheduler-invalid1'), null, null)
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/scheduler-invalid1/testconfig') }
  options.profile = 'test'
  const revane = new RevaneIOC(options)
  try {
    await revane.initialize()
  } catch (error) {
    t.is(error.code, 'REV_ERR_INVALID_CRON_PATTERN_PROVIDED')
  }
})

test('Should schedule task #3', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../testdata/scheduler-invalid2'),
    [new SchedulingExtension(null)]
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(path.join(__dirname, '../../testdata/scheduler-invalid2'), null, null)
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/scheduler-invalid2/testconfig') }
  options.profile = 'test'
  const revane = new RevaneIOC(options)

  try {
    await revane.initialize()
  } catch (error) {
    t.is(error.code, 'REV_ERR_NO_CRON_PATTERN_PROVIDED')
  }
})

test('Should not schedule tasks', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../testdata/scheduler-invalid3'),
    [new SchedulingExtension(null)]
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(path.join(__dirname, '../../testdata/scheduler-invalid3'), null, null)
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/scheduler-invalid3/testconfig') }
  options.profile = 'test'
  const revane = new RevaneIOC(options)
  await revane.initialize()
  t.pass()
})

test('Should handle error in scheduled task', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../testdata/scheduler-throws'),
    [new SchedulingExtension(null)]
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(path.join(__dirname, '../../testdata/scheduler-throws'), null, null)
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/scheduler-throws/testconfig') }
  options.profile = 'test'
  const revane = new RevaneIOC(options)
  await revane.initialize()
  await wait()
  const errorHandler = await revane.get('errorHandler')
  t.true(errorHandler.handledError)
})

test('Should handle error in scheduled async task', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../testdata/scheduler-throws3'),
    [new SchedulingExtension(null)]
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(path.join(__dirname, '../../testdata/scheduler-throws3'), null, null)
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/scheduler-throws3/testconfig') }
  options.profile = 'test'
  const revane = new RevaneIOC(options)
  await revane.initialize()
  await wait()
  const errorHandler = await revane.get('errorHandler')
  t.true(errorHandler.handledError)
})

test('Should handle error in scheduled task with default handler', async (t) => {
  const options = new Options(
    path.join(__dirname, '../../testdata/scheduler-throws2'),
    [new SchedulingExtension(null)]
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(path.join(__dirname, '../../testdata/scheduler-throws2'), null, null)
  ]
  options.configuration = { disabled: false, directory: path.join(__dirname, '../../../testdata/scheduler-throws2/testconfig') }
  options.profile = 'test'
  const revane = new RevaneIOC(options)
  await revane.initialize()
  await wait()
  t.pass()
})

test('schedulerLoader should return correct type', (t) => {
  const loader = new SchedulerLoader(
    new TaskScheduler()
  )
  t.is(loader.type(), 'taskScheduler')
})

async function wait (): Promise<void> {
  return await new Promise((resolve) => {
    setTimeout(resolve, 1100)
  })
}
