import { RethrowableError } from '../../RethrowableError.js'

export default class DependencyNotFoundError extends RethrowableError {
  public code = 'REV_ERR_DEPENDENCY_NOT_FOUND'

  constructor (id: string, parentId: string) {
    super(`Dependency id=${id} for bean id=${parentId} not found`)
    Error.captureStackTrace(this, DependencyNotFoundError)
  }
}
