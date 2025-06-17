export default class CircularDependencyError extends Error {
  public code = 'REV_ERR_CIRCULAR_DEPENDENCY'

  constructor (id: string) {
    super(`bean id=${id} has circular dependency on itself.`)
    Error.captureStackTrace(this, CircularDependencyError)
  }
}
