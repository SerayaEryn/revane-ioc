export class NoCronPatternProvided extends Error {
  public code: string = 'REV_ERR_NO_CRON_PATTERN_PROVIDED'

  constructor () {
    super('no cron pattern provided')
    Error.captureStackTrace(this, NoCronPatternProvided)
  }
}
