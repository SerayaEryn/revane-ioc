'use strict';

import { Scope } from '../../src/revane-componentscan/Decorators'
import { Scopes } from '../../src/revane-ioc-core/Scopes'
import { ConfigurationProperties } from '../../src/revane-ioc/RevaneIOC'

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
