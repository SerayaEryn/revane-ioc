export class ModuleLoadError extends Error {
  public code: string = 'REV_ERR_MODULE_LOAD_ERROR'

  constructor (file: string) {
    super(`failed to load ${file}`)
    Error.captureStackTrace(this, ModuleLoadError)
  }
}
