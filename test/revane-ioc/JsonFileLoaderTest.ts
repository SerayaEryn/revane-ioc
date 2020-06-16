import * as path from 'path'
import * as test from 'tape-catch'
import JsonFileLoader from '../../src/revane-ioc/loaders/JsonFileLoader'

test('should read json configuration file and register beans', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/json/config.json')

  const jsonFileResolver = new JsonFileLoader()

  return jsonFileResolver.load({ file }, null)
    .then((beanDefinitions) => {
      t.deepEqual(beanDefinitions, [
        {
          dependencies: [],
          id: 'json1',
          class: './json/json1.js',
          dependencyIds: []
        },
        {
          dependencies: [],
          id: 'json2',
          class: './json/json2',
          dependencyIds: [ { ref: 'json1' } ]
        }
      ])
    })
})

test('should reject on error', (t) => {
  t.plan(1)

  const file = path.join(__dirname, '../../../testdata/json/configa.json')

  const jsonFileResolver = new JsonFileLoader()

  return jsonFileResolver.load({ file }, null)
    .catch((err) => {
      t.ok(err)
    })
})

test('isRelevant', t => {
  t.plan(2)

  t.ok(new JsonFileLoader().isRelevant({ file: '.json' }))
  t.notOk(new JsonFileLoader().isRelevant({ file: '.xml' }))
})
