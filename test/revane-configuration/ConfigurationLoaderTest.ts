import test from 'ava'
import { ConfigurationLoader } from '../../src/revane-configuration/ConfigurationLoader'
import { ConfigurationOptions, RevaneConfiguration } from '../../src/revane-configuration/RevaneConfiguration'

test('should return correct type', (t) => {
  const config = new ConfigurationLoader(
    new RevaneConfiguration(
      new ConfigurationOptions(
        'test', '.', false, true, [], ''
      )
    )
  )

  t.is(config.type(), 'configuration')
})
