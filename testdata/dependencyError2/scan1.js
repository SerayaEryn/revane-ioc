'use strict';

import { Component } from '../../bin/src/revane-ioc/RevaneIOC.js';

const Scan1 = Component('scan2')(class Scan1 {
  constructor(scan2) {
    this.scan2 = scan2;
  }
})

export { Scan1 }
