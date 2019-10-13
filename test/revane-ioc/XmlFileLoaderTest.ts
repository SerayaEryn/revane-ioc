import * as path from 'path'
import * as test from 'tape-catch'
import XmlFileLoader from '../../src/revane-ioc/loaders/XmlFileLoader'

test('should read xml configuration file and register beans', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/xml/config.xml')

  const xmlFileResolver = new XmlFileLoader({ file }, null)

  return xmlFileResolver.load()
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions, [
        {
          options: {},
          id: 'xml1',
          class: './xml/xml1.js',
          properties: [],
          scope: 'singleton'
        },
        {
          options: {},
          id: 'xml2',
          class: './xml/xml2',
          properties: [{
            ref: 'xml1'
          }],
          scope: 'singleton'
        },
        {
          options: {},
          id: 'xml3',
          class: './xml/xml3',
          properties: [
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

  t.ok(XmlFileLoader.isRelevant({ file: '.xml' }))
  t.notOk(XmlFileLoader.isRelevant({ file: '.json' }))
})

test('should reject on error', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/json/configa.json')

  const xmlFileLoader = new XmlFileLoader({ file }, null)

  return xmlFileLoader.load()
    .catch((err) => {
      t.ok(err)
    })
})

test('should trigger scan from xml #2', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/xml/config6.xml')
  const basePackage = path.join(__dirname, '../../../testdata')

  const xmlFileResolver = new XmlFileLoader({ file, basePackage }, basePackage)

  return xmlFileResolver.load()
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions, [
        {
          options: { inject: undefined },
          id: 'scan1',
          class: './scan1.js',
          properties: [ { ref: 'test6' } ],
          scope: 'singleton',
          type: 'component'
        },
        {
          options: { inject: undefined },
          id: 'scan2',
          class: './scan2.js',
          properties: [ { ref: 'test6' } ],
          scope: 'singleton',
          type: 'component'
        },
        {
          options: { inject: undefined },
          id: 'scan3',
          class: './scan3.js',
          properties: [ { ref: 'test6' } ],
          scope: 'singleton',
          type: 'component'
        },
        {
          options: { inject: [ 'test6' ] },
          id: 'scan4',
          class: './scan4.js',
          properties: [],
          scope: 'singleton',
          type: 'component'
        },
        {
          options: { inject: undefined },
          id: 'test7',
          class: './test7.js',
          properties: [ { ref: 'test6' } ],
          scope: 'singleton',
          type: 'service'
        },
        {
          options: { inject: undefined },
          id: 'test8',
          class: './test8.js',
          properties: [ { ref: 'test6' } ],
          scope: 'singleton',
          type: 'service'
        },
        {
          options: { inject: undefined },
          id: 'test9',
          class: './test9.js',
          properties: [],
          scope: 'singleton',
          type: 'controller'
        }
      ])
    })
})

test('should trigger scan from xml', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/xml/config5.xml')
  const basePackage = path.join(__dirname, '../../../testdata')

  const xmlFileResolver = new XmlFileLoader({ file, basePackage }, basePackage)

  return xmlFileResolver.load()
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions, [
        {
          options: { inject: undefined },
          id: 'scan1',
          class: './scan1.js',
          properties: [ { ref: 'test6' } ],
          scope: 'singleton',
          type: 'component'
        },
        {
          options: { inject: undefined },
          id: 'scan2',
          class: './scan2.js',
          properties: [ { ref: 'test6' } ],
          scope: 'singleton',
          type: 'component'
        },
        {
          options: { inject: undefined },
          id: 'scan3',
          class: './scan3.js',
          properties: [ { ref: 'test6' } ],
          scope: 'singleton',
          type: 'component'
        },
        {
          options: { inject: [ 'test6' ] },
          id: 'scan4',
          class: './scan4.js',
          properties: [],
          scope: 'singleton',
          type: 'component'
        },
        {
          options: { inject: undefined },
          id: 'test7',
          class: './test7.js',
          properties: [ { ref: 'test6' } ],
          scope: 'singleton',
          type: 'service'
        },
        {
          options: { inject: undefined },
          id: 'test8',
          class: './test8.js',
          properties: [ { ref: 'test6' } ],
          scope: 'singleton',
          type: 'service'
        },
        {
          options: { inject: undefined },
          id: 'test9',
          class: './test9.js',
          properties: [],
          scope: 'singleton',
          type: 'controller'
        }
      ])
    })
})
