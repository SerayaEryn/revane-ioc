import * as test from 'tape-catch'
import { ConfigurationLoader } from '../../src/revane-configuration/ConfigurationLoader'

test('should return correct type', (t) => {
  t.plan(1)
  const config = new ConfigurationLoader(null)

  t.equals(config.type(), 'configuration')
})
