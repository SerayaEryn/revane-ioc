import { RethrowableError } from '../../RethrowableError'

export default class DependencyNotFoundError extends RethrowableError {
  public code: string = 'REV_ERR_DEPENDENCY_NOT_FOUND'

  constructor (id: string, parentId: string) {
    super(`Dependency id=${id} for bean id=${parentId} not found`)
    Error.captureStackTrace(this, DependencyNotFoundError)
  }
}
