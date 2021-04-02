'use strict'

import { Scheduled } from '../../src/revane-ioc/RevaneIOC'

export default class SchedulerThrowing3 {
  public executed = false

  @Scheduled('* * * * * *')
  public async test () {
    throw new Error('booom')
  }
}
