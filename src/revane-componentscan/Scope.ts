import { PROTOTYPE_VALUE, SINGLETON_VALUE } from "../revane-ioc-core/Scopes.js";
import { setMetadata } from "../revane-utils/Metadata.js";
import { scopeSym } from "./Symbols.js";

function Scope(scope: typeof SINGLETON_VALUE | typeof PROTOTYPE_VALUE) {
  return function ScopeDecorator(
    target: any,
    context?: ClassDecoratorContext,
  ): void | any {
    setMetadata(scopeSym, scope, target, context);
    return context == null ? target : undefined;
  };
}

export { Scope };
