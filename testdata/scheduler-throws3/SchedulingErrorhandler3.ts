import { TaskScheduler } from '../../src/revane-scheduler/TaskScheduler.js'

export default class SchedulingErrorhandler3 {
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
