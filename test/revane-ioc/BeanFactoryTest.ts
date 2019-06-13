import * as path from 'path'
import * as test from 'tape-catch'
import Revane from '../../src/revane-ioc/RevaneIOC'

test('should create bean using beanFactory', async (t) => {
  t.plan(5)

  const options = {
    basePackage: path.join(__dirname, '../../../'),
    componentScan: false,
    loaderOptions: [
      { file: path.join(__dirname, '../../../testdata/beanFactory.json') }
    ]
  }
  const revane = new Revane(options)
  await revane.initialize()
  const bean1 = revane.has('beanFactory')
  const hasTestBean = revane.has('testBean')
  const hasTestBean2 = revane.has('testBean2')

  t.ok(bean1)
  t.ok(hasTestBean)
  t.ok(hasTestBean2)
  const testBean = revane.get('testBean')
  t.equals(testBean.test, '42')
  const testBean2 = revane.get('testBean2')
  t.equals(testBean2.test, '43')
})