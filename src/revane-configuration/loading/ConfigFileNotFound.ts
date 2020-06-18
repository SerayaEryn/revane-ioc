export class ConfigFileNotFound extends Error {
  public code: string = 'REV_ERR_CONFIG_FILE_NOT_FOUND'

  constructor (file: string) {
    super(`${file} not found`)
    Error.captureStackTrace(this, ConfigFileNotFound)
  }
}
