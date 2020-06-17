import * as test from 'tape-catch'
import * as path from 'path'
import RevaneIOC from '../../src/revane-ioc/RevaneIOC'

test('Should schedule task', async (t) => {
  t.plan(1)

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
  t.ok((await revane.get('scan56')).executed)
  await revane.close()
})

test('Should schedule task #2', async (t) => {
  t.plan(1)

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
    t.equals(error.code, 'REV_ERR_INVALID_CRON_PATTERN_PROVIDED')
  }
})

test('Should schedule task #3', async (t) => {
  t.plan(1)

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
    t.equals(error.code, 'REV_ERR_NO_CRON_PATTERN_PROVIDED')
  }
})

test('Should not schedule tasks', async (t) => {
  t.plan(1)

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

function wait () {
  return new Promise((resolve) => {
    setTimeout(resolve, 1100)
  })
}
