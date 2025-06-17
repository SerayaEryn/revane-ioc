'use strict'

import { Scheduled } from '../../src/revane-ioc/RevaneIOC.js'

export default class SchedulerThrowing1 {
  public executed = false

  @Scheduled('* * * * * *')
  public test () {
    throw new Error('booom')
  }
}
