export const REV_ERR_KEY_TYPE_MISMATCH = "REV_ERR_KEY_TYPE_MISMATCH";

export class TypeMismatch extends Error {
  public code = REV_ERR_KEY_TYPE_MISMATCH;

  constructor(key: string, type: string) {
    super(`the value for the  key ${key} is not a ${type}`);
    Error.captureStackTrace(this, TypeMismatch);
  }
}
