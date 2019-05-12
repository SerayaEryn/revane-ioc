'use strict'

import 'reflect-metadata'

export function createScopeDecorator () {
  return function decoratoteScope (scope: string) {
    return function define (Class) {
      Reflect.defineMetadata('scope', scope, Class)
      return Class
    }
  }
}
