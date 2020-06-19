'use strict'

import { Scheduler } from '../../src/revane-ioc/RevaneIOC'
import { TaskScheduler } from '../../src/revane-scheduler/TaskScheduler'

@Scheduler
export default class ErrorHandler {
  handledError: boolean = false
  constructor (taskScheduler: TaskScheduler) {
    const that = this
    taskScheduler.setErrorHandler((error: Error) => {
      that.handledError = true
    })
  }
}
