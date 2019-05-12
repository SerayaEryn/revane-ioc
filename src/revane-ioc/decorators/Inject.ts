'use strict'

import 'reflect-metadata'

export function createInjectDecorator () {
  return function decoratoteInject (options: string | string[]) {
    return function define (Class) {
      const ids = typeof options === 'string' ? [options] : options
      Reflect.defineMetadata('inject', ids, Class)
      return Class
    }
  }
}
