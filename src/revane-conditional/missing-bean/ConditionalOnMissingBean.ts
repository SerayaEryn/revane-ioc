import { conditionalOnMissingBeanSym } from "../Symbols.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ConditionalOnMissingBeanNew(
  maybeTarget?,
  context?: ClassDecoratorContext,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
): Function | any {
  if (maybeTarget != null) {
    return decorateNew(maybeTarget, context!);
  } else {
    return decorateNew;
  }
}

function decorateNew(_: any, context: ClassDecoratorContext) {
  context.metadata![conditionalOnMissingBeanSym] = true;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function ConditionalOnMissingBean(maybeTarget?): Function | any {
  if (maybeTarget != null) {
    return decorate(maybeTarget);
  } else {
    return decorate;
  }
}

function decorate(target: any): any {
  Reflect.defineMetadata(conditionalOnMissingBeanSym, true, target);
  return target;
}

export { ConditionalOnMissingBean };
