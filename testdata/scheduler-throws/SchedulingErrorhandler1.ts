import { TaskScheduler } from '../../src/revane-scheduler/TaskScheduler'

export default class SchedulingErrorhandler1 {
  handledError = false
  constructor (taskScheduler: TaskScheduler) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    taskScheduler.setErrorHandler((error: Error) => {
      that.handledError = true
    })
  }
}
