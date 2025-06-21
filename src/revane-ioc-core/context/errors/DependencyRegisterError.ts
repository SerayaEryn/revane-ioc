export const REV_ERR_DEPENDENCY_REGISTER = "REV_ERR_DEPENDENCY_REGISTER";

export default class DependencyRegisterError extends Error {
  public code = REV_ERR_DEPENDENCY_REGISTER;

  constructor(id: string, error: Error) {
    super("Failed to register dependency id=" + id);
    Error.captureStackTrace(this, DependencyRegisterError);
    if (this.stack != null) {
      this.stack += "\nCaused by\n";
      this.stack += error.stack;
    }
  }
}
