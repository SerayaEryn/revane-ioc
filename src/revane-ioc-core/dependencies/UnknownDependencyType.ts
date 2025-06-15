import { RethrowableError } from '../RethrowableError'

export default class UnknownDependencyType extends RethrowableError {
  public code = 'REV_ERR_UNKNOWN_DEPENDENCY_TYPE'

  constructor (type: string) {
    super(`Unknown dependency type '${type}'`)
    Error.captureStackTrace(this, UnknownDependencyType)
  }
}
