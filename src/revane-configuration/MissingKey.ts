export const REV_ERR_KEY_MISSING = "REV_ERR_KEY_MISSING";

export class MissingKey extends Error {
  public code = REV_ERR_KEY_MISSING;

  constructor(public key: string) {
    super(`the value for the key ${key} is missing`);
    Error.captureStackTrace(this, MissingKey);
  }
}
