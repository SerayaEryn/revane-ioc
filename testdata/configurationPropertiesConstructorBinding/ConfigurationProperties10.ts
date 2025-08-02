import {ConfigurationProperties, ConstructorBinding} from '../../src/revane-ioc/RevaneIOC.js'

@ConfigurationProperties({ prefix: 'test' })
@ConstructorBinding
export class ConfigurationProperties10 {
  properties

  constructor(public property1, public property2) {
    this.properties = [property1, property2]
  }
}
