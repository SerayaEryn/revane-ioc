import { Scheduled } from '../../src/revane-ioc/RevaneIOC'

export default class Scheduler1 {
  public executed = false

  @Scheduled('* * * * * *')
  public test () {
    this.executed = true
  }
}
