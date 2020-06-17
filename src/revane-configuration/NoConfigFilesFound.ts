export class NoConfigFilesFound extends Error {
  public code: string

  constructor () {
    super('no configuration files found')
    this.code = 'REV_ERR_NO_CONFIG_FILES_FOUND'
    Error.captureStackTrace(this, NoConfigFilesFound)
  }
}
