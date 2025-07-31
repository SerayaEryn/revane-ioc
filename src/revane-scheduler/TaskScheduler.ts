import { Cron } from "croner";
import { PreDestroy } from "../revane-ioc/RevaneIOC.js";

export class TaskScheduler {
  readonly #jobs: Cron[] = [];
  #errorHandler: (error: Error) => void = (error) => {
    console.log(error);
  };

  public schedule(
    cronPattern: string,
    functionToSchedule: () => Promise<void>,
    isAsyncFunction: boolean,
  ): void {
    const job = new Cron(cronPattern, { timezone: "UTC" }, () => {
      this.#executeTask(isAsyncFunction, functionToSchedule);
    });
    this.#jobs.push(job);
  }

  @PreDestroy
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
    functionToSchedule: () => Promise<void>,
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
