import { TaskScheduler } from '../../src/revane-scheduler/TaskScheduler'

export default class SchedulingErrorhandler3 {
  handledError: boolean = false
  constructor (taskScheduler: TaskScheduler) {
    const that = this
    taskScheduler.setErrorHandler((error: Error) => {
      that.handledError = true
    })
  }
}
