import * as path from 'path'
import test from 'ava'
import JsonFileLoader from '../../src/revane-ioc/loaders/JsonFileLoader'
import { JsonFileLoaderOptions } from '../../src/revane-ioc/loaders/JsonFileLoaderOptions'

test('should read json configuration file and register beans', async (t): Promise<void> => {
  const file = path.join(__dirname, '../../../testdata/json/config.json')

  const jsonFileResolver = new JsonFileLoader()

  return await jsonFileResolver.load([new JsonFileLoaderOptions(file)])
    .then((beanDefinitions) => {
      t.is(beanDefinitions.length, 2)
    })
})

test('should reject on error', async (t) => {
  const file = path.join(__dirname, '../../../testdata/json/configa.json')

  const jsonFileResolver = new JsonFileLoader()

  await t.throwsAsync(async () => {
    await jsonFileResolver.load([new JsonFileLoaderOptions(file)])
  })
})

test('should return correct type', (t) => {
  const jsonFileResolver = new JsonFileLoader()

  t.is(jsonFileResolver.type(), 'json')
})
