export const REV_ERR_KEY_NOT_PRESENT_IN_CONFIG =
  "REV_ERR_KEY_NOT_PRESENT_IN_CONFIG";

export class KeyNotPresentInConfig extends Error {
  public code = REV_ERR_KEY_NOT_PRESENT_IN_CONFIG;

  constructor(key: string) {
    super(`propery ${key} not present in configuration!`);
    Error.captureStackTrace(this, KeyNotPresentInConfig);
  }
}
