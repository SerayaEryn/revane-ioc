import { setMetadata } from "../../revane-utils/Metadata.js";
import { conditionalOnMissingBeanSym } from "../Symbols.js";

function ConditionalOnMissingBean(
  maybeTarget?,
  context?: ClassDecoratorContext,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
): Function | any {
  if (maybeTarget != null) {
    return decorate(maybeTarget, context);
  } else {
    return decorate;
  }
}

function decorate(target: any, context?: ClassDecoratorContext): any {
  setMetadata(conditionalOnMissingBeanSym, true, target, context);
  return context == null ? target : undefined;
}

export { ConditionalOnMissingBean };
