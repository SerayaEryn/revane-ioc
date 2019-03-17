import * as test from 'tape-catch'
import BeanLoader from '../../src/revane-ioc-core/BeanLoader'
import Loader from '../../src/revane-ioc-core/Loader'
import BeanDefinition from '../../src/revane-ioc-core/BeanDefinition'

test('should reject on errors in loaders', async (t) => {
  t.plan(1)

  class MockedLoader implements Loader {
    load (): Promise<BeanDefinition[]> {
      throw new Error('booom')
    }

    static isRelevant (): boolean {
      return true
    }
  }

  const beanLoader = new BeanLoader([MockedLoader])

  try {
    await beanLoader.getBeanDefinitions({
      basePackage: '.',
      loaderOptions: [{}]
    })
  } catch (error) {
    t.equals(error.message, 'booom')
  }
})

test('should handle undefined loaderOptions', async (t) => {
  t.plan(1)

  const beanLoader = new BeanLoader([])

  await beanLoader.getBeanDefinitions({ basePackage: '.' })
  t.pass()
})
