import { CronJob } from 'cron'

export class TaskScheduler {
  private readonly jobs: CronJob[] = []
  private errorHandler: (error: Error) => void = () => {}

  public schedule (
    cronPattern: string,
    functionToSchedule: Function,
    asyncFunction: boolean
  ): void {
    const { errorHandler } = this
    const job = new CronJob(
      cronPattern,
      function test () {
        if (asyncFunction) {
          functionToSchedule()
            .catch(errorHandler)
        } else {
          try {
            functionToSchedule()
          } catch (error) {
            errorHandler(error)
          }
        }
      },
      null,
      true,
      'UTC'
    )
    this.jobs.push(job)
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
