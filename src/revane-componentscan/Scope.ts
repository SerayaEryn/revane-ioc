import { scopeSym } from "./Symbols.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ScopeNew(scope: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return function ScopeDecorator(
    target: Function,
    context: ClassDecoratorContext,
  ): void {
    context.metadata![scopeSym] = scope;
  };
}

function Scope(scope: string) {
  return function ScopeDecorator(target) {
    Reflect.defineMetadata(scopeSym, scope, target);
    return target;
  };
}

export { Scope };
