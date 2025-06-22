export const REV_ERR_CIRCULAR_DEPENDENCY = "REV_ERR_CIRCULAR_DEPENDENCY";

export default class CircularDependencyError extends Error {
  public code = REV_ERR_CIRCULAR_DEPENDENCY;
  public ids: string[];

  constructor(ids: string[]) {
    super(`bean id=${ids[0]} has circular dependency on itself.`);
    Error.captureStackTrace(this, CircularDependencyError);
    this.ids = ids;
  }
}
