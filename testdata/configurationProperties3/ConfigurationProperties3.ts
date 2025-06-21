import { Scopes } from '../../src/revane-ioc-core/Scopes.js'
import { ConfigurationProperties, Scope } from '../../src/revane-ioc/RevaneIOC.js'

@Scope(Scopes.PROTOTYPE)
@ConfigurationProperties({ prefix: 'test' })
export class ConfigurationProperties3 {
  property1 = null
  property2 = 42

  setProperty1 (property1) {
    this.property1 = property1
  }

  setProperty2 (property2) {
    this.property2 = property2
  }
}
