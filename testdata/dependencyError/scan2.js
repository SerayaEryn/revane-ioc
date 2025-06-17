'use strict';

import { Component } from '../../bin/src/revane-ioc/RevaneIOC.js';

const Scan1 = Component('scan2')(class Scan1 {
  constructor() {
    throw new Error('booom')
  }
})

export { Scan1 }