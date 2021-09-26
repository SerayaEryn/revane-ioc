import { join } from 'path'
import RevaneIOC, {
  ComponentScanExtension,
  ComponentScanLoaderOptions,
  Options
} from '../../src/revane-ioc/RevaneIOC'
import test from 'ava'

test('should get beans type component', async (t) => {
  const options = new Options(
    join(__dirname, '../../testdata'),
    [new ComponentScanExtension()]
  )
  options.loaderOptions = [
    new ComponentScanLoaderOptions(
      join(__dirname, '../../testdata/injectByType'),
      [],
      []
    )
  ]
  options.configuration = { disabled: true }
  options.profile = 'test'
  const revane = new RevaneIOC(options)
  await revane.initialize()

  const bean1 = await revane.get('test1')
  const bean2 = await revane.get('test2')

  t.is(bean1.a, bean2)
})
