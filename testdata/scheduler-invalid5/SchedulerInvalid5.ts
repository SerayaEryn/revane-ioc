import { Scheduled, Scheduler } from '../../src/revane-ioc/RevaneIOC.js'

@Scheduler
export default class SchedulerInvalid5 {
  public executed = false

  @Scheduled(64 as any)
  public test () {
    this.executed = true
  }
}
