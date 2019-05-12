'use strict'

import 'reflect-metadata'
import { injectSym } from './Symbols'

export function createInjectDecorator () {
  return function decoratoteInject (options: string | string[]) {
    return function define (Class) {
      const ids = typeof options === 'string' ? [options] : options
      Reflect.defineMetadata(injectSym, ids, Class)
      return Class
    }
  }
}
