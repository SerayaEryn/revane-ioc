import { Scheduled, Scheduler } from '../../src/revane-ioc/RevaneIOC.js'

@Scheduler
export default class SchedulerInvalid2 {
  public executed = false

  @Scheduled('pihadfh')
  public test () {
    this.executed = true
  }
}
