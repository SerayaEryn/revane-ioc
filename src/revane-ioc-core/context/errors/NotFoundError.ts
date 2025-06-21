export const REV_ERR_NOT_FOUND = "REV_ERR_NOT_FOUND";

export default class NotFoundError extends Error {
  public code = REV_ERR_NOT_FOUND;
  public id: string;

  constructor(id: string) {
    super(`${id} not found`);
    this.id = id;
    Error.captureStackTrace(this, NotFoundError);
  }
}
