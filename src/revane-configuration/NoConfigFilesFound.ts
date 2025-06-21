export const REV_ERR_NO_CONFIG_FILES_FOUND = "REV_ERR_NO_CONFIG_FILES_FOUND";

export class NoConfigFilesFound extends Error {
  public code = REV_ERR_NO_CONFIG_FILES_FOUND;

  constructor() {
    super("no configuration files found");
    Error.captureStackTrace(this, NoConfigFilesFound);
  }
}
