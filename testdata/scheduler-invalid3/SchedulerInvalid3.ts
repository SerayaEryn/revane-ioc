'use strict'

import { Scheduled, Scheduler } from '../../src/revane-ioc/RevaneIOC.js'

@Scheduler
export default class SchedulerInvalid3 {
  public executed = false

  @Scheduled('hpasf')
  public test () {
    this.executed = true
  }
}
