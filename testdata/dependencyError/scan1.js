'use strict';

const Component = require('../../bin/src/revane-ioc/RevaneIOC').Component;

class Scan1 {
  constructor(scan2) {
    this.scan2 = scan2;
  }
}

module.exports = Component()(Scan1);
