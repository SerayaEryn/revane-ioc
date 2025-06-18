export class KeyNotPresentInConfig extends Error {
  public code: string;

  constructor(key: string) {
    super(`propery ${key} not present in configuration!`);
    this.code = "REV_ERR_KEY_NOT_PRESENT_IN_CONFIG";
    Error.captureStackTrace(this, KeyNotPresentInConfig);
  }
}
