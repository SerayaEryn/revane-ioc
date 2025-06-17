import { RethrowableError } from '../revane-ioc-core/RethrowableError.js'

export class InvalidCronPatternProvided extends RethrowableError {
  public code = 'REV_ERR_INVALID_CRON_PATTERN_PROVIDED'

  constructor (cronPattern: string) {
    super(`invalid cronpattern ${cronPattern} provided`)
    Error.captureStackTrace(this, InvalidCronPatternProvided)
  }
}
