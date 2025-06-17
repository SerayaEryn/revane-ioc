import test from 'ava'
import BeanLoader from '../../src/revane-ioc-core/BeanLoader.js'
import Loader from '../../src/revane-ioc-core/Loader.js'
import DefaultBeanDefinition from '../../src/revane-ioc-core/DefaultBeanDefinition.js'

test('should reject on errors in loaders', async (t) => {
  t.plan(1)

  class MockedLoader implements Loader {
    async load (): Promise<DefaultBeanDefinition[]> {
      throw new Error('booom')
    }

    type (): string {
      return 'mock'
    }
  }

  const beanLoader = new BeanLoader([new MockedLoader()])

  try {
    await beanLoader.getBeanDefinitions({
      basePackage: '.',
      loaderOptions: []
    })
  } catch (error) {
    t.is(error.message, 'booom')
  }
})

test('should handle undefined loaderOptions', async (t) => {
  t.plan(1)

  const beanLoader = new BeanLoader([])

  await beanLoader.getBeanDefinitions({ basePackage: '.', loaderOptions: [] })
  t.pass()
})
