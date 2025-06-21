export const REV_ERR_DEFINED_TWICE = "REV_ERR_DEFINED_TWICE";

export default class ConflictingBeanDefinitionError extends Error {
  public code = REV_ERR_DEFINED_TWICE;
  public id: string

  constructor(id: string) {
    super(`Conflicting with bean withg same id for bean with id=${id}`);
    Error.captureStackTrace(this, ConflictingBeanDefinitionError);
    this.id = id
  }
}
