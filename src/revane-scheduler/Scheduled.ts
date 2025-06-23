import { setMetadata } from "../revane-utils/Metadata.js";
import { scheduledSym } from "./Symbols.js";

function Scheduled(cronPattern: string) {
  return function define(
    target,
    propertyKey: string | ClassMethodDecoratorContext,
    _: PropertyDescriptor,
  ): void {
    if (typeof propertyKey == "string") {
      setMetadata(
        scheduledSym,
        {
          cronPattern,
          propertyKey,
        },
        target,
      );
    } else {
      const context = propertyKey as ClassMethodDecoratorContext;
      context.metadata![scheduledSym] = {
        cronPattern,
        propertyKey: context.name,
      };
      return target;
    }
  };
}

export { Scheduled };
