'use strict'

export default class BeanDefinedTwiceError extends Error {
  public code: string = 'REV_ERR_DEFINED_TWICE'

  constructor (id: string) {
    super(`bean ${id} defined twice`)
    Error.captureStackTrace(this, BeanDefinedTwiceError)
  }
}
