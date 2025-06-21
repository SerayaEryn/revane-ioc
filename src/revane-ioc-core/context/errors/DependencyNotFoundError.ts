import { RethrowableError } from "../../RethrowableError.js";

export const REV_ERR_DEPENDENCY_NOT_FOUND = "REV_ERR_DEPENDENCY_NOT_FOUND";

export default class DependencyNotFoundError extends RethrowableError {
  public code = REV_ERR_DEPENDENCY_NOT_FOUND;
  public id: string
  public parentId: string


  constructor(id: string, parentId: string) {
    super(`Dependency id=${id} for bean id=${parentId} not found`);
    Error.captureStackTrace(this, DependencyNotFoundError);
    this.id = id
    this.parentId = parentId
  }
}
