import { Constructor } from "../revane-ioc-core/Constructor";

export function setMetadata(
  sym: any,
  value: any,
  target: Constructor,
  context?: ClassDecoratorContext,
) {
  if (typeof context !== "object") {
    Reflect.defineMetadata(sym, value, target);
  } else {
    context.metadata![sym] = value;
  }
}

export function getMetadata(sym: any, target: Constructor): any {
  return Reflect.getMetadata(sym, target) ?? target[Symbol["metadata"]] ?? null;
}
