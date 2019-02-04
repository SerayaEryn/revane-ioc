'use strict';

const RevaneIOC = require('./bin/src/revane-ioc/RevaneIOC');

module.exports = RevaneIOC.default;
for (const key of Object.keys(RevaneIOC)) {
  module.exports[key] = RevaneIOC[key];
}