'use strict';

import { Scope, Component } from '../../bin/src/revane-ioc/RevaneIOC.js'

const Xml3 = Scope('boooom')(Component(class Xml3 {
  constructor() {}
}))

export { Xml3 }
