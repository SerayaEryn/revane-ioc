import test from 'ava'
import * as path from 'path'
import RevaneIOC from '../../src/revane-ioc/RevaneIOC'
import { SchedulerLoader } from '../../src/revane-scheduler/SchedulerLoader'

test('Should schedule task', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../testdata'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../testdata/scheduler') }
    ],
    configuration: { disabled: false },
    profile: 'test'
  }
  const revane = new RevaneIOC(options)
  await revane.initialize()

  await wait()
  t.true((await revane.get('scan56')).executed)
  await revane.close()
})

test('Should schedule task #2', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../testdata/scheduler-invalid1'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../testdata/scheduler-invalid1') }
    ],
    configuration: { disabled: false, directory: '/testconfig' },
    profile: 'test'
  }
  const revane = new RevaneIOC(options)
  try {
    await revane.initialize()
  } catch (error) {
    t.is(error.code, 'REV_ERR_INVALID_CRON_PATTERN_PROVIDED')
  }
})

test('Should schedule task #3', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../testdata/scheduler-invalid2'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../testdata/scheduler-invalid2') }
    ],
    configuration: { disabled: false, directory: '/testconfig' },
    profile: 'test'
  }
  const revane = new RevaneIOC(options)

  try {
    await revane.initialize()
  } catch (error) {
    t.is(error.code, 'REV_ERR_NO_CRON_PATTERN_PROVIDED')
  }
})

test('Should not schedule tasks', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../testdata/scheduler-invalid3'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../testdata/scheduler-invalid3') }
    ],
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/scheduler-invalid3/testconfig') },
    profile: 'test'
  }
  const revane = new RevaneIOC(options)
  await revane.initialize()
  t.pass()
})

test('Should handle error in scheduled task', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../testdata/scheduler-throws'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../testdata/scheduler-throws') }
    ],
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/scheduler-throws/testconfig') },
    profile: 'test'
  }
  const revane = new RevaneIOC(options)
  await revane.initialize()
  await wait()
  const errorHandler = await revane.get('errorHandler')
  t.true(errorHandler.handledError)
})

test('Should handle error in scheduled async task', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../testdata/scheduler-throws3'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../testdata/scheduler-throws3') }
    ],
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/scheduler-throws3/testconfig') },
    profile: 'test'
  }
  const revane = new RevaneIOC(options)
  await revane.initialize()
  await wait()
  const errorHandler = await revane.get('errorHandler')
  t.true(errorHandler.handledError)
})

test('Should handle error in scheduled task with default handler', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../testdata/scheduler-throws2'),
    loaderOptions: [
      { componentScan: true, basePackage: path.join(__dirname, '../../testdata/scheduler-throws2') }
    ],
    configuration: { disabled: false, directory: path.join(__dirname, '../../../testdata/scheduler-throws2/testconfig') },
    profile: 'test'
  }
  const revane = new RevaneIOC(options)
  await revane.initialize()
  await wait()
  t.pass()
})

test('schedulerLoader should return correct type', (t) => {
  const loader = new SchedulerLoader(null)
  t.is(loader.type(), 'taskScheduler')
})

async function wait (): Promise<void> {
  return await new Promise((resolve) => {
    setTimeout(resolve, 1100)
  })
}
