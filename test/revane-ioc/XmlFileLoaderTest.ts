import * as path from 'path'
import * as test from 'tape-catch'
import XmlFileLoader from '../../src/revane-ioc/loaders/XmlFileLoader'

test('should read xml configuration file and register beans', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/xml/config.xml')

  const xmlFileResolver = new XmlFileLoader()

  return xmlFileResolver.load({ file }, null)
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions, [
        {
          dependencies: [],
          id: 'xml1',
          class: './xml/xml1.js',
          dependencyIds: [],
          scope: 'singleton'
        },
        {
          dependencies: [],
          id: 'xml2',
          class: './xml/xml2',
          dependencyIds: [{
            ref: 'xml1'
          }],
          scope: 'singleton'
        },
        {
          dependencies: [],
          id: 'xml3',
          class: './xml/xml3',
          dependencyIds: [
            { ref: 'xml1' },
            { ref: 'xml2' }
          ],
          scope: 'singleton'
        }
      ])
    })
})

test('isRelevant', t => {
  t.plan(2)

  t.ok(new XmlFileLoader().isRelevant({ file: '.xml' }))
  t.notOk(new XmlFileLoader().isRelevant({ file: '.json' }))
})

test('should reject on error', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/json/configa.json')

  const xmlFileLoader = new XmlFileLoader()

  return xmlFileLoader.load({ file }, null)
    .catch((err) => {
      t.ok(err)
    })
})

test('should trigger scan from xml #2', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/xml/config6.xml')
  const basePackage = path.join(__dirname, '../../../testdata/scan')

  const xmlFileResolver = new XmlFileLoader()

  return xmlFileResolver.load({ file, basePackage }, basePackage)
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions.length, 4)
    })
})

test('should trigger scan from xml', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/xml/config5.xml')
  const basePackage = path.join(__dirname, '../../../testdata/scan')

  const xmlFileResolver = new XmlFileLoader()

  return xmlFileResolver.load({ file, basePackage }, basePackage)
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions.length, 4)
    })
})

test('should return correct type', (t) => {
  t.plan(1)

  const xmlFileLoader = new XmlFileLoader()

  t.equals(xmlFileLoader.type(), 'xml')
})
