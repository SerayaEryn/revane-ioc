'use strict'

export default class DependencyRegisterError extends Error {
  public code = 'REV_ERR_DEPENDENCY_REGISTER'

  constructor (id: string, error: Error) {
    super('Failed to register dependency id=' + id)
    Error.captureStackTrace(this, DependencyRegisterError)
    if (this.stack != null) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      this.stack += '\nCaused by\n'
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      this.stack += error.stack
    }
  }
}
