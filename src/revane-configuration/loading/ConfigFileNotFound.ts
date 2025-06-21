export const REV_ERR_CONFIG_FILE_NOT_FOUND = "REV_ERR_CONFIG_FILE_NOT_FOUND";

export class ConfigFileNotFound extends Error {
  public code = REV_ERR_CONFIG_FILE_NOT_FOUND;

  constructor(file: string) {
    super(`${file} not found`);
    Error.captureStackTrace(this, ConfigFileNotFound);
  }
}
