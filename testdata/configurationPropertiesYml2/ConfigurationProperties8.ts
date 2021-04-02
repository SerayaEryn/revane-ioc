import { ConfigurationProperties } from '../../src/revane-ioc/RevaneIOC'

@ConfigurationProperties({ prefix: 'test' })
export class ConfigurationProperties8 {
  property1 = null
  property2 = 42

  setProperty1 (property1) {
    this.property1 = property1
  }

  setProperty2 (property2) {
    this.property2 = property2
  }
}
