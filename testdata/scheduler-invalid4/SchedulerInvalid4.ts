import { Scheduled, Scheduler } from '../../src/revane-ioc/RevaneIOC.js'

@Scheduler
export default class SchedulerInvalid4 {
  public executed = false

  @Scheduled(null!)
  public test () {
    this.executed = true
  }
}
