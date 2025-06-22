import { RethrowableError } from "../revane-ioc-core/RethrowableError.js";

export const REV_ERR_INVALID_CRON_PATTERN_PROVIDED =
  "REV_ERR_INVALID_CRON_PATTERN_PROVIDED";

export class InvalidCronPatternProvided extends RethrowableError {
  public code = REV_ERR_INVALID_CRON_PATTERN_PROVIDED;
  public id: string;
  public cronPattern: string;

  constructor(id: string, cronPattern: string) {
    super(`invalid cronpattern ${cronPattern} provided`);
    Error.captureStackTrace(this, InvalidCronPatternProvided);
    this.id = id;
    this.cronPattern = cronPattern;
  }
}
