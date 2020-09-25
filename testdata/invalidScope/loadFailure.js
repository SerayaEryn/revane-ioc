'use strict';

const { Scope, Component } = require('../../bin/src/revane-ioc/RevaneIOC')

class Xml3 {
  constructor() {}
}

module.exports = Scope('boooom')(Component(Xml3))
