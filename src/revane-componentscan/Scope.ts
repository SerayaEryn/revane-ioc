import { setMetadata } from "../revane-utils/Metadata.js";
import { scopeSym } from "./Symbols.js";

function Scope(scope: string) {
  return function ScopeDecorator(
    target: any,
    context?: ClassDecoratorContext,
  ): void | any {
    setMetadata(scopeSym, scope, target, context);
    return context == null ? target : undefined;
  };
}

export { Scope };
