import {
  BeanDefinition,
  BeanFactoryPostProcessor,
  ValueWrapper,
} from "../revane-ioc/RevaneIOC.js";
import Bean from "../revane-ioc-core/context/bean/Bean.js";
import { getMetadata } from "../revane-utils/Metadata.js";
import { cacheSym } from "./Symbols.js";
import { CachableData, CacheData } from "./decorators/CacheDecoratorData.js";
import { isAsyncFunction } from "node:util/types";
import { CacheManager } from "./CacheManager.js";

export class CacheBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
  #cacheManager: CacheManager;

  constructor(cacheManager: CacheManager) {
    this.#cacheManager = cacheManager;
  }

  async postProcess(
    beanDefinition: BeanDefinition,
    _bean: Bean,
    instance: any,
  ): Promise<void> {
    if (beanDefinition.classConstructor?.prototype != null) {
      const metas: Map<string | symbol, CachableData> = getMetadata(
        cacheSym,
        beanDefinition.classConstructor.prototype,
      );
      if (metas == null) {
        return;
      }
      for (const methodName in metas) {
        const meta: CacheData = metas[methodName];
        const originalFunction = instance[methodName].bind(instance);
        if (isAsyncFunction(instance[methodName])) {
          instance[methodName] = async (...args: any[]): Promise<any> => {
            return await this.asyncWrapper(meta, args, originalFunction);
          };
        } else {
          instance[methodName] = (...args: any[]): any => {
            return this.syncWrapper(meta, args, originalFunction);
          };
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private syncWrapper(meta, args: any[], originalFunction: Function): any {
    this.handleCacheEvictAll(meta);
    this.handleCacheEvict(meta, args);
    let value: ValueWrapper | undefined;
    if (meta.cachePut != null && meta.cachePut.length > 0) {
      value = new ValueWrapper(originalFunction(...args));
      this.handleCachePut(meta, args, value);
    }
    if (meta.cacheables != null && meta.cacheables.length > 0) {
      const key1 = meta.cacheables[0].keyGen(args);
      const cache1 = this.getCache(meta.cacheables[0]);

      const valueWrapper = cache1?.get(key1);
      if (valueWrapper == null) {
        value = new ValueWrapper(originalFunction(...args));
      } else {
        value = valueWrapper;
      }
    }
    this.handleSyncCachable(meta, args, value);
    if (value != null) {
      return value.value;
    }
    return;
  }

  private async asyncWrapper(
    meta: CacheData,
    args: any[],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    originalFunction: Function,
  ): Promise<any> {
    this.handleCacheEvictAll(meta);
    this.handleCacheEvict(meta, args);
    let value: ValueWrapper | undefined;
    if (meta.cachePut != null && meta.cachePut.length > 0) {
      value = new ValueWrapper(await originalFunction(...args));
      this.handleCachePut(meta, args, value);
    }
    if (meta.cacheables != null && meta.cacheables.length > 0) {
      const key1 = meta.cacheables[0].keyGen(args);
      const cache1 = this.getCache(meta.cacheables[0]);

      const valueWrapper = cache1?.get(key1);
      if (valueWrapper == null) {
        value = new ValueWrapper(originalFunction(...args));
      } else {
        value = valueWrapper;
      }
    }
    await this.handleAsyncCachable(meta, args, value);
    if (value != null) {
      return value.value;
    }
    return;
  }

  private handleCacheEvictAll(meta: CacheData) {
    if (meta.cacheEvictAll == null) {
      return;
    }
    for (const cacheName of meta.cacheEvictAll) {
      const cache = this.#cacheManager.getCache(cacheName);
      cache?.clear();
    }
  }

  private handleCacheEvict(meta: CacheData, args: any[]) {
    if (meta.cacheEvict == null) {
      return;
    }
    for (const evict of meta.cacheEvict) {
      const key = evict.keyGen(args);
      const cache = this.getCache(evict);
      cache?.evict(key);
    }
  }

  private handleSyncCachable(
    meta: CacheData,
    args: any[],
    value: ValueWrapper | undefined,
  ): any {
    if (meta.cacheables == null || meta.cacheables.length === 0) {
      return;
    }
    for (const cacheable of meta.cacheables) {
      const key = cacheable.keyGen(args);
      const cache = this.getCache(cacheable);
      cache?.put(key, value?.value);
    }
  }

  private handleCachePut(
    meta: CacheData,
    args: any[],
    value: ValueWrapper | null,
  ) {
    if (meta.cachePut == null || meta.cachePut.length === 0) {
      return;
    }

    for (const cacheable of meta.cachePut) {
      const key = cacheable.keyGen(args);
      const cache = this.getCache(cacheable);
      cache?.put(key, value?.value);
    }
  }

  private async handleAsyncCachable(
    meta: CacheData,
    args: any[],
    value: ValueWrapper | undefined,
  ): Promise<any> {
    if (meta.cacheables == null || meta.cacheables.length === 0) {
      return;
    }
    for (const cacheable of meta.cacheables) {
      const key = cacheable.keyGen(args);
      const cache = this.getCache(cacheable);
      cache?.put(key, value?.value);
    }
  }

  private getCache(cacheable: CachableData) {
    return this.#cacheManager.getCache(cacheable.cacheName);
  }
}
