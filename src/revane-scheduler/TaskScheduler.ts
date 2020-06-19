import { CronJob } from 'cron'

export class TaskScheduler {
  private readonly jobs: CronJob[] = []
  private errorHandler: (error: Error) => void = () => {}

  public schedule (
    cronPattern: string,
    functionToSchedule: Function,
    isAsyncFunction: boolean
  ): void {
    const job = new CronJob(
      cronPattern,
      () => {
        this.executeTask(isAsyncFunction, functionToSchedule)
      },
      null,
      true,
      'UTC'
    )
    this.jobs.push(job)
  }

  private executeTask (asyncFunction: boolean, functionToSchedule: Function): void {
    if (asyncFunction) {
      functionToSchedule()
        .catch(this.errorHandler)
    } else {
      try {
        functionToSchedule()
      } catch (error) {
        this.errorHandler(error)
      }
    }
  }

  public close (): void {
    for (const job of this.jobs) {
      job.stop()
    }
  }

  public setErrorHandler (errorHandler: (error: Error) => void): void {
    this.errorHandler = errorHandler
  }
}
