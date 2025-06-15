export class ModuleLoadError extends Error {
  public code = 'REV_ERR_MODULE_LOAD_ERROR'

  constructor (file: string, error: Error) {
    super(`failed to load ${file}\nCause: ${error.stack ?? ''}`)
    Error.captureStackTrace(this, ModuleLoadError)
  }
}
