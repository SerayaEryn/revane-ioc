'use strict';

const ConfigurationProperties = require('../../bin/src/revane-ioc/RevaneIOC').ConfigurationProperties;
const Component = require('../../bin/src/revane-ioc/RevaneIOC').Component;

class Scan56 {
  property1
  property2 = 42
}

module.exports = ConfigurationProperties({ prefix: 'test' })(Component()(Scan56));
