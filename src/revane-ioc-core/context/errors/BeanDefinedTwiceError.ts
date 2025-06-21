export const REV_ERR_DEFINED_TWICE = "REV_ERR_DEFINED_TWICE";

export default class BeanDefinedTwiceError extends Error {
  public code = REV_ERR_DEFINED_TWICE;

  constructor(id: string) {
    super(`bean id=${id} defined twice`);
    Error.captureStackTrace(this, BeanDefinedTwiceError);
  }
}
