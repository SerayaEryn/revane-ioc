import { conditionalOnMissingBeanSym } from './Symbols.js'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function createConditionalOnMissingBeanDecorator (): Function {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return function decorateWithOptions (maybeTarget?): Function | any {
    if (maybeTarget != null) {
      return decorate(maybeTarget)
    } else {
      return decorate
    }
  }
}

function decorate (target: any): any {
  Reflect.defineMetadata(conditionalOnMissingBeanSym, true, target)
  return target
}
