'use strict';

const Inject = require('..').Inject;
const Component = require('..').Component;

class Scan4 {}

module.exports = Inject('test6')(Component()(Scan4));
