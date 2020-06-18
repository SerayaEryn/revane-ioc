import test from 'ava'
import { LoadingStrategy } from '../../src/revane-configuration/loading/LoadingStrategy'
import { RevaneConfiguration, ConfigurationOptions } from '../../src/revane-configuration/RevaneConfiguration'

test('Should load values', async (t) => {
  t.plan(8)
  const testLoadingStrategy = new TestLoadingStrategy()
  const config = new RevaneConfiguration(new ConfigurationOptions(
    'test',
    '.',
    false,
    false,
    [ testLoadingStrategy ]
  ))
  await config.init()
  t.true(config.getBoolean('test.bool'))
  t.is(config.getString('test.str'), 'test')
  t.is(config.getNumber('test.int'), 42)
  t.false(config.has('blub.bla'))
  try {
    config.getString('blub.bla')
  } catch (error) {
    t.is(error.code, 'REV_ERR_KEY_NOT_PRESENT_IN_CONFIG')
  }
  try {
    config.getNumber('test.str')
  } catch (error) {
    t.is(error.code, 'REV_ERR_KEY_TYPE_MISMATCH')
  }
  try {
    config.getBoolean('test.str')
  } catch (error) {
    t.is(error.code, 'REV_ERR_KEY_TYPE_MISMATCH')
  }
  try {
    config.getString('test.int')
  } catch (error) {
    t.is(error.code, 'REV_ERR_KEY_TYPE_MISMATCH')
  }
})

test('Should throw error if no config files', async (t) => {
  t.plan(1)
  const config = new RevaneConfiguration(new ConfigurationOptions(
    'test',
    '.',
    true,
    false,
    []
  ))
  try {
    await config.init()
  } catch (error) {
    t.is(error.code, 'REV_ERR_NO_CONFIG_FILES_FOUND')
  }
})

test('Should pass error from strategy', async (t) => {
  t.plan(1)
  const config = new RevaneConfiguration(new ConfigurationOptions(
    'test',
    '.',
    true,
    false,
    [ new FailingLoadingStrategy() ]
  ))
  try {
    await config.init()
  } catch (error) {
    t.is(error.message, 'boooom')
  }
})

class TestLoadingStrategy implements LoadingStrategy {
  load (configDirectory: string, profile: string): Promise<object> {
    return Promise.resolve({
      test: {
        int: 42,
        str: 'test',
        bool: true
      }
    })
  }
}

class FailingLoadingStrategy implements LoadingStrategy {
  load (configDirectory: string, profile: string): Promise<object> {
    return Promise.reject(new Error('boooom'))
  }
}
