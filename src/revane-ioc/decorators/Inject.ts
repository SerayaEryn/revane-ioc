'use strict'

import 'reflect-metadata'
import Decorator from './Decorator'

export default class Inject extends Decorator {
  public define (Class) {
    const ids = typeof this.options === 'string' ? [this.options] : this.options
    Reflect.defineMetadata('inject', ids, Class)
    return Class
  }
}
