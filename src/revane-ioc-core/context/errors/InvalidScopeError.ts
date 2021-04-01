'use strict'

import { RethrowableError } from '../../RethrowableError'

export default class InvalidScopeError extends RethrowableError {
  public code: string = 'REV_ERR_INVALID_SCOPE'

  constructor (scope: string) {
    super('invalid scope: ' + scope)
    Error.captureStackTrace(this, InvalidScopeError)
  }
}
