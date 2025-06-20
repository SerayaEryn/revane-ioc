import { Cron } from "croner";

export class TaskScheduler {
  readonly #jobs: Cron[] = [];
  #errorHandler: (error: Error) => void = (error) => {
    console.log(error);
  };

  public schedule(
    cronPattern: string,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    functionToSchedule: Function,
    isAsyncFunction: boolean,
  ): void {
    const job = new Cron(cronPattern, { timezone: "UTC" }, () => {
      this.#executeTask(isAsyncFunction, functionToSchedule);
    });
    this.#jobs.push(job);
  }

  public close(): void {
    for (const job of this.#jobs) {
      job.stop();
    }
  }

  public setErrorHandler(errorHandler: (error: Error) => void): void {
    this.#errorHandler = errorHandler;
  }

  #executeTask(
    asyncFunction: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    functionToSchedule: Function,
  ): void {
    if (asyncFunction) {
      try {
        functionToSchedule().then().catch(this.#errorHandler);
      } catch (error) {
        this.#errorHandler(error);
      }
    } else {
      try {
        functionToSchedule();
      } catch (error) {
        this.#errorHandler(error);
      }
    }
  }
}
