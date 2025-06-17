import { RethrowableError } from '../../RethrowableError.js'

export default class InvalidScopeError extends RethrowableError {
  public code = 'REV_ERR_INVALID_SCOPE'

  constructor (scope: string) {
    super('invalid scope: ' + scope)
    Error.captureStackTrace(this, InvalidScopeError)
  }
}
