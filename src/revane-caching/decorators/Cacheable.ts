import { getMetadata, setMetadata } from "../../revane-utils/Metadata.js";
import { cacheSym } from "../Symbols.js";

export interface CacheData {
  cacheables?: CachableData[];
  cacheEvict?: CachableData[];
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
    const metas: Map<string | symbol, CachableData> =
      getMetadata(cacheSym, target) ?? {};
    if (metas[methodName] == null) {
      metas[methodName] = {};
    }
    const meta: CacheData = metas[methodName];
    if (meta.cacheables == null) {
      meta.cacheables = [];
    }
    meta.cacheables.push({ cacheName, keyGen });
    setMetadata(
      cacheSym,
      metas,
      target,
      propertyKey as ClassMethodDecoratorContext,
    );
  };
}
