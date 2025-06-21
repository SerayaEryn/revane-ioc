export const REV_ERR_NOT_INITIALIZED = "REV_ERR_NOT_INITIALIZED";

export default class NotInitializedError extends Error {
  public code = REV_ERR_NOT_INITIALIZED;
  constructor() {
    super("not initialized");
    Error.captureStackTrace(this, NotInitializedError);
  }
}
