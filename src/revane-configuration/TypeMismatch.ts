export class TypeMismatch extends Error {
  public code: string

  constructor (key: string, type: string) {
    super(`the value for the  key ${key} is not a ${type}`)
    this.code = 'REV_ERR_KEY_TYPE_MISMATCH'
    Error.captureStackTrace(this, TypeMismatch)
  }
}
