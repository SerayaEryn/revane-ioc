import { getMetadata, setMetadata } from "../revane-utils/Metadata.js";
import { cachableSym } from "./Symbols.js";

export interface CacheData {
  methodName: string | symbol;
  cacheables: CachableData[];
}

export interface CachableData {
  cacheName: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  keyGen: Function;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function Cacheable(cacheName: string, keyGen: Function): Function {
  return function CachableDecorator(
    target: any,
    propertyKey: string | ClassMethodDecoratorContext,
    _: PropertyDescriptor,
  ) {
    const methodName =
      typeof propertyKey === "string"
        ? propertyKey
        : (propertyKey as ClassMethodDecoratorContext).name;
    const meta: CacheData = getMetadata(cachableSym, target) ?? {};
    meta.methodName = methodName;
    if (meta.cacheables == null) {
      meta.cacheables = [];
    }
    meta.cacheables.push({ cacheName, keyGen });
    setMetadata(
      cachableSym,
      meta,
      target,
      propertyKey as ClassMethodDecoratorContext,
    );
  };
}
