import { getMetadata, setMetadata } from "../../revane-utils/Metadata.js";
import { cacheSym } from "../Symbols.js";
import { CachableData, CacheData } from "./CacheDecoratorData.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function CachePut(cacheName: string, keyGen: Function): Function {
  return function CachePutDecorator(
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
    if (meta.cachePut == null) {
      meta.cachePut = [];
    }
    meta.cachePut.push({ cacheName, keyGen });
    setMetadata(
      cacheSym,
      metas,
      target,
      propertyKey as ClassMethodDecoratorContext,
    );
  };
}
