'use strict'

import { Scheduled } from '../../src/revane-ioc/RevaneIOC'

export default class SchedulerThrowing2 {
  public executed = false

  @Scheduled('* * * * * *')
  public test () {
    throw new Error('booom')
  }
}
