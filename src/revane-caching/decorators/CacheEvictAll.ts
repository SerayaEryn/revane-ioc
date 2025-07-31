import { getMetadata, setMetadata } from "../../revane-utils/Metadata.js";
import { cacheSym } from "../Symbols.js";
import { CacheData } from "./CacheDecoratorData.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function CacheEvictAll(cacheName: string): Function {
  return function CacheEvictAllDecorator(
    target: any,
    propertyKey: string | ClassMethodDecoratorContext,
    _: PropertyDescriptor,
  ) {
    const methodName =
      typeof propertyKey === "string"
        ? propertyKey
        : (propertyKey as ClassMethodDecoratorContext).name;
    const metas: Map<string | symbol, CacheData> =
      getMetadata(cacheSym, target) ?? {};
    if (metas[methodName] == null) {
      metas[methodName] = {};
    }
    const meta: CacheData = metas[methodName];
    if (meta.cacheEvictAll == null) {
      meta.cacheEvictAll = [];
    }
    meta.cacheEvictAll.push(cacheName);
    setMetadata(
      cacheSym,
      metas,
      target,
      propertyKey as ClassMethodDecoratorContext,
    );
  };
}
