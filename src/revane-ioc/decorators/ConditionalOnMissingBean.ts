import { conditionalOnMissingBeanSym } from './Symbols'

export function createConditionalOnMissingBeanDecorator (): Function {
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
