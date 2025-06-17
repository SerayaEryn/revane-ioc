import { Scheduled, Scheduler } from '../../src/revane-ioc/RevaneIOC.js'

@Scheduler
export default class SchedulerInvalid2 {
  public executed = false

  @Scheduled()
  public test () {
    this.executed = true
  }
}
