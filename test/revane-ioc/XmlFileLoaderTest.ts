import * as path from 'path'
import * as test from 'tape-catch'
import XmlFileLoader from '../../src/revane-ioc/loaders/XmlFileLoader'

test('should read xml configuration file and register beans', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/xml/config.xml')

  const xmlFileResolver = new XmlFileLoader({ file })

  return xmlFileResolver.load()
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions, [
        {
          options: {},
          id: 'xml1',
          class: './xml/xml1.js'
        },
        {
          options: {},
          id: 'xml2',
          class: './xml/xml2',
          properties: [{
            ref: 'xml1'
          }]
        },
        {
          options: {},
          id: 'xml3',
          class: './xml/xml3',
          properties: [
            { ref: 'xml1' },
            { ref: 'xml2' }
          ]
        }
      ])
    })
})

test('isRelevant', t => {
  t.plan(2)

  t.ok(XmlFileLoader.isRelevant({ file: '.xml' }))
  t.notOk(XmlFileLoader.isRelevant({ file: '.json' }))
})

test('should reject on error', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/json/configa.json')

  const xmlFileLoader = new XmlFileLoader({ file })

  return xmlFileLoader.load()
    .catch((err) => {
      t.ok(err)
    })
})
