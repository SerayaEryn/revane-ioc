'use strict';

const Component = require('../../bin/src/revane-ioc/RevaneIOC').Component;

class Scan1 {
  constructor() {
    throw new Error('booom')
  }
}

exports.default = Component('scan2')(Scan1);
