export const REV_ERR_UNKNOWN_ENDING = "REV_ERR_UNKNOWN_ENDING";

export default class UnknownEndingError extends Error {
  public code = REV_ERR_UNKNOWN_ENDING;

  constructor() {
    super("unsupported file type");
    Error.captureStackTrace(this, UnknownEndingError);
  }
}
