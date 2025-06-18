import { scopeSym } from "./Symbols.js";

export function createScopeDecorator() {
  return function decoratoteScope(scope: string) {
    return function define(Class) {
      Reflect.defineMetadata(scopeSym, scope, Class);
      return Class;
    };
  };
}
