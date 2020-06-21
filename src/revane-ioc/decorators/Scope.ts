'use strict'

import { scopeSym } from './Symbols'
import { Reflect } from '../../revane-utils/Reflect'

export function createScopeDecorator () {
  return function decoratoteScope (scope: string) {
    return function define (Class) {
      Reflect.defineMetadata(scopeSym, scope, Class)
      return Class
    }
  }
}
