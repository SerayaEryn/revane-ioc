import test from 'ava'
import { join } from 'path'
import RevaneIOC, { Options, SchedulingExtension } from '../../src/revane-ioc/RevaneIOC'
import { SchedulerLoader } from '../../src/revane-scheduler/SchedulerLoader'
import { TaskScheduler } from '../../src/revane-scheduler/TaskScheduler'
import SchedulerInvalid1 from '../../testdata/scheduler-invalid1/SchedulerInvalid1'
import SchedulerInvalid2 from '../../testdata/scheduler-invalid2/SchedulerInvalid2'
import SchedulerInvalid3 from '../../testdata/scheduler-invalid3/SchedulerInvalid3'
import SchedulerThrowing1 from '../../testdata/scheduler-throws/SchedulerThrowing1'
import SchedulingErrorhandler1 from '../../testdata/scheduler-throws/SchedulingErrorhandler1'
import SchedulerThrowing2 from '../../testdata/scheduler-throws2/SchedulerThrowing2'
import SchedulerThrowing3 from '../../testdata/scheduler-throws3/SchedulerThrowing3'
import SchedulingErrorhandler3 from '../../testdata/scheduler-throws3/SchedulingErrorhandler3'
import Scheduler1 from '../../testdata/scheduler/Scheduler1'
import Scheduler2 from '../../testdata/scheduler2/Scheduler2'
import { beanDefinition, MockedExtension } from '../MockedLoader'

test('Should schedule task', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata/scheduler'),
    [
      new MockedExtension([
        beanDefinition('scan56', Scheduler1)
      ]),
      new SchedulingExtension(null)
    ]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false, directory: join(__dirname, '../../../testdata/scheduler/testconfig') }
  options.profile = 'test'
  const revane = new RevaneIOC(options)
  await revane.initialize()

  await wait()
  t.true((await revane.get('scan56')).executed)
  await revane.close()
})

test('Should schedule task enabled via extension options', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata/scheduler2'),
    [
      new MockedExtension([
        beanDefinition('scan56', Scheduler2)
      ]),
      new SchedulingExtension({ enabled: true })
    ]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false, directory: join(__dirname, '../../../testdata/scheduler2/testconfig') }
  options.profile = 'test'
  const revane = new RevaneIOC(options)
  await revane.initialize()

  await wait()
  t.true((await revane.get('scan56')).executed)
  await revane.close()
})

test('Should schedule task #2', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata/scheduler-invalid1'),
    [
      new MockedExtension([
        beanDefinition('scan56', SchedulerInvalid1)
      ]),
      new SchedulingExtension(null)
    ]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false, directory: join(__dirname, '../../../testdata/scheduler-invalid1/testconfig') }
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
    join(__dirname, '../../testdata/scheduler-invalid2'),
    [
      new MockedExtension([
        beanDefinition('scan56', SchedulerInvalid2)
      ]),
      new SchedulingExtension(null)
    ]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false, directory: join(__dirname, '../../../testdata/scheduler-invalid2/testconfig') }
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
    join(__dirname, '../../testdata/scheduler-invalid3'),
    [
      new MockedExtension([
        beanDefinition('scan56', SchedulerInvalid3)
      ]),
      new SchedulingExtension(null)
    ]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false, directory: join(__dirname, '../../../testdata/scheduler-invalid3/testconfig') }
  options.profile = 'test'
  const revane = new RevaneIOC(options)
  await revane.initialize()
  t.pass()
})

test('Should handle error in scheduled task', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata/scheduler-throws'),
    [
      new MockedExtension([
        beanDefinition('scan56', SchedulerThrowing1),
        beanDefinition('errorHandler', SchedulingErrorhandler1, ['taskScheduler'])
      ]),
      new SchedulingExtension(null)
    ]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false, directory: join(__dirname, '../../../testdata/scheduler-throws/testconfig') }
  options.profile = 'test'
  const revane = new RevaneIOC(options)
  await revane.initialize()
  await wait()
  const errorHandler = await revane.get('errorHandler')
  t.true(errorHandler.handledError)
})

test('Should handle error in scheduled async task', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata/scheduler-throws3'),
    [
      new MockedExtension([
        beanDefinition('scan56', SchedulerThrowing3),
        beanDefinition('errorHandler', SchedulingErrorhandler3, ['taskScheduler'])
      ]),
      new SchedulingExtension(null)
    ]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false, directory: join(__dirname, '../../../testdata/scheduler-throws3/testconfig') }
  options.profile = 'test'
  const revane = new RevaneIOC(options)
  await revane.initialize()
  await wait()
  const errorHandler = await revane.get('errorHandler')
  t.true(errorHandler.handledError)
})

test('Should handle error in scheduled task with default handler', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata/scheduler-throws2'),
    [
      new MockedExtension([
        beanDefinition('scan56', SchedulerThrowing2)
      ]),
      new SchedulingExtension(null)
    ]
  )
  options.loaderOptions = []
  options.configuration = { disabled: false, directory: join(__dirname, '../../../testdata/scheduler-throws2/testconfig') }
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
