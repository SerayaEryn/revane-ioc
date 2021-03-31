import * as path from 'path'
import test from 'ava'
import XmlFileLoader from '../../src/revane-ioc/loaders/XmlFileLoader'
import { XmlFileLoaderOptions } from '../../src/revane-ioc/loaders/XmlFileLoaderOptions'

test('should read xml configuration file and register beans', async (t): Promise<void> => {
  t.plan(1)
  const basePackage = path.join(__dirname, '../../../testdata')
  const file = path.join(__dirname, '../../../testdata/xml/config.xml')

  const xmlFileResolver = new XmlFileLoader()

  return await xmlFileResolver.load([new XmlFileLoaderOptions(basePackage, file)])
    .then((beanDefinitions) => {
      t.is(beanDefinitions.length, 3)
    })
})

test('should reject on error', async (t) => {
  const basePackage = path.join(__dirname, '../../../testdata')
  const file = path.join(__dirname, '../../../testdata/json/configa.json')

  const xmlFileLoader = new XmlFileLoader()

  await t.throwsAsync(async () => {
    await xmlFileLoader.load([new XmlFileLoaderOptions(basePackage, file)])
  })
})

test('should trigger scan from xml #2', async (t): Promise<void> => {
  const file = path.join(__dirname, '../../../testdata/xml/config6.xml')
  const basePackage = path.join(__dirname, '../../testdata/scan')

  const xmlFileResolver = new XmlFileLoader()

  return await xmlFileResolver.load([new XmlFileLoaderOptions(basePackage, file)])
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions.length, 5)
    })
})

test('should trigger scan from xml', async (t): Promise<void> => {
  const file = path.join(__dirname, '../../../testdata/xml/config5.xml')
  const basePackage = path.join(__dirname, '../../testdata/scan')

  const xmlFileResolver = new XmlFileLoader()

  return await xmlFileResolver.load([new XmlFileLoaderOptions(basePackage, file)])
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions.length, 5)
    })
})

test('should return correct type', (t) => {
  const xmlFileLoader = new XmlFileLoader()

  t.is(xmlFileLoader.type(), 'xml')
})
