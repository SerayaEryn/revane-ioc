import * as path from 'path'
import test from 'ava'
import Revane from '../../src/revane-ioc/RevaneIOC'

test('should create bean using beanFactory', async (t) => {
  const options = {
    basePackage: path.join(__dirname, '../../../'),
    componentScan: false,
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/beanFactory.json') }
    ],
    profile: 'test',
    configuration: { disabled: true }
  }
  const revane = new Revane(options)
  await revane.initialize()
  const bean1 = await revane.has('beanFactory')
  const hasTestBean = await revane.has('testBean')
  const hasTestBean2 = await revane.has('testBean2')

  t.truthy(bean1)
  t.truthy(hasTestBean)
  t.truthy(hasTestBean2)
  const testBean = await revane.get('testBean')
  t.is(testBean.test, '42')
  const testBean2 = await revane.get('testBean2')
  t.is(testBean2.test, '43')
})
