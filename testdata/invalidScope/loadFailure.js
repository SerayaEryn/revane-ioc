'use strict';

const { Scope, Component } = require('../../bin/src/revane-ioc/RevaneIOC')

class Xml3 {
  constructor(xml1, xml2) {
    this.xml1 = xml1;
    this.xml2 = xml2;
  }
}

module.exports = Scope('boooom')(Component(Xml3))
