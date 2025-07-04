'use strict'

import { Scheduled, Scheduler } from '../../src/revane-ioc/RevaneIOC.js'

@Scheduler
export default class Scheduler2 {
  public executed = false

  @Scheduled('* * * * * *')
  public test () {
    this.executed = true
  }
}
