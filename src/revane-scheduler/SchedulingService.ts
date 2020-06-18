import { CronJob } from 'cron'

export class SchedulingService {
  private readonly jobs: CronJob[] = []

  public schedule (cronPattern: string, functionToSchedule: Function): void {
    const job = new CronJob(
      cronPattern,
      function test () {
        try {
          functionToSchedule()
        } catch (error) {
          console.log(error)
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
}
