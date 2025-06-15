import { RethrowableError } from '../revane-ioc-core/RethrowableError'

export class NoCronPatternProvided extends RethrowableError {
  public code = 'REV_ERR_NO_CRON_PATTERN_PROVIDED'

  constructor () {
    super('no cron pattern provided')
    Error.captureStackTrace(this, NoCronPatternProvided)
  }
}
