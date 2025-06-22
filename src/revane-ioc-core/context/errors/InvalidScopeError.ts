import { RethrowableError } from "../../RethrowableError.js";

export const REV_ERR_INVALID_SCOPE = "REV_ERR_INVALID_SCOPE";

export default class InvalidScopeError extends RethrowableError {
  public code = REV_ERR_INVALID_SCOPE;
  public id: string;
  public scope: string;

  constructor(id: string, scope: string) {
    super(`bean id='${id}' has invalid scope='${scope}'`);
    Error.captureStackTrace(this, InvalidScopeError);
    this.id = id;
    this.scope = scope;
  }
}
