'use strict'

import { Scheduled, Scheduler } from '../../src/revane-ioc/RevaneIOC'

@Scheduler
export default class Scan56 {
  public executed = false

  @Scheduled(42)
  public test () {
    this.executed = true
  }
}
