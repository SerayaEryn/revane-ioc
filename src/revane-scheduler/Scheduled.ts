import { setMetadata } from "../revane-utils/Metadata.js";
import { scheduledSym } from "./Symbols.js";

function Scheduled(cronPattern: string) {
  return function define(
    target,
    propertyKey: string | ClassMethodDecoratorContext,
    _: PropertyDescriptor,
  ): void {
    const context = propertyKey as ClassMethodDecoratorContext;
    setMetadata(
      scheduledSym,
      {
        cronPattern,
        propertyKey,
      },
      target,
      context,
    );
    console.log(cronPattern);
  };
}

export { Scheduled };
