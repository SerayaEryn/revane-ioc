import * as path from 'path'
import * as test from 'tape-catch'
import JsonFileLoader from '../../src/revane-ioc/loaders/JsonFileLoader'

test('should read json configuration file and register beans', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/json/config.json')

  const jsonFileResolver = new JsonFileLoader({ file })

  return jsonFileResolver.load()
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions, [
        {
          id: 'json1',
          class: './json/json1.js'
        },
        {
          id: 'json2',
          class: './json/json2',
          properties: [{
            ref: 'json1'
          }]
        }
      ])
    })
})

test('should reject on error', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/json/configa.json')

  const jsonFileResolver = new JsonFileLoader({ file })

  return jsonFileResolver.load()
    .catch((err) => {
      t.ok(err)
    })
})

test('isRelevant', t => {
  t.plan(2)

  t.ok(JsonFileLoader.isRelevant({ file: '.json' }))
  t.notOk(JsonFileLoader.isRelevant({ file: '.xml' }))
})
