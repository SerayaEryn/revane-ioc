'use strict'

import { Scheduled, Scheduler } from '../../src/revane-ioc/RevaneIOC.js'

@Scheduler
export default class SchedulerInvalid1 {
  public executed = false

  @Scheduled("42")
  public test () {
    this.executed = true
  }
}
