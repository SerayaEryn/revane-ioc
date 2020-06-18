'use strict';

const Component = require('../../bin/src/revane-ioc/RevaneIOC').Component;

class Scan1 {
  constructor() {
  }
}

exports.default = Component('scan1')(Scan1);
