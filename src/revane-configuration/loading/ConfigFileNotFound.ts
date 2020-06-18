export class ConfigFileNotFound extends Error {
  public code: string

  constructor (file) {
    super(`${file} not found`)
    this.code = 'REV_ERR_CONFIG_FILE_NOT_FOUND'
    Error.captureStackTrace(this, ConfigFileNotFound)
  }
}
