import test from 'ava'
import { ConfigurationLoader } from '../../src/revane-configuration/ConfigurationLoader'

test('should return correct type', (t) => {
  const config = new ConfigurationLoader(null)

  t.is(config.type(), 'configuration')
})
