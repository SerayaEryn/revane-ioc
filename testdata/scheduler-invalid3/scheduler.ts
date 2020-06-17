'use strict'

import { Scheduled, Scheduler } from '../../src/revane-ioc/RevaneIOC'

@Scheduler
export default class Scan56 {
  public executed = false

  @Scheduled()
  public test () {
    this.executed = true
  }
}
