import * as path from 'path'
import test from 'ava'
import XmlFileLoader from '../../src/revane-ioc/loaders/XmlFileLoader'

test('should read xml configuration file and register beans', async (t): Promise<void> => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/xml/config.xml')

  const xmlFileResolver = new XmlFileLoader()

  return await xmlFileResolver.load({ file }, null)
    .then((beanDefinitions) => {
      t.is(beanDefinitions.length, 3)
    })
})

test('isRelevant', t => {
  t.true(new XmlFileLoader().isRelevant({ file: '.xml' }))
  t.false(new XmlFileLoader().isRelevant({ file: '.json' }))
})

test('should reject on error', async (t) => {
  const file = path.join(__dirname, '../../../testdata/json/configa.json')

  const xmlFileLoader = new XmlFileLoader()

  await t.throwsAsync(async () => {
    await xmlFileLoader.load({ file }, null)
  })
})

test('should trigger scan from xml #2', async (t): Promise<void> => {
  const file = path.join(__dirname, '../../../testdata/xml/config6.xml')
  const basePackage = path.join(__dirname, '../../testdata/scan')

  const xmlFileResolver = new XmlFileLoader()

  return await xmlFileResolver.load({ file, basePackage }, basePackage)
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions.length, 5)
    })
})

test('should trigger scan from xml', async (t): Promise<void> => {
  const file = path.join(__dirname, '../../../testdata/xml/config5.xml')
  const basePackage = path.join(__dirname, '../../testdata/scan')

  const xmlFileResolver = new XmlFileLoader()

  return await xmlFileResolver.load({ file, basePackage }, basePackage)
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions.length, 5)
    })
})

test('should return correct type', (t) => {
  const xmlFileLoader = new XmlFileLoader()

  t.is(xmlFileLoader.type(), 'xml')
})
