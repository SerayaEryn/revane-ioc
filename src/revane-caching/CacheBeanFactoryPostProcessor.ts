import {
  BeanDefinition,
  BeanFactoryPostProcessor,
} from "../revane-ioc/RevaneIOC.js";
import Bean from "../revane-ioc-core/context/bean/Bean.js";
import { getMetadata } from "../revane-utils/Metadata.js";
import { cacheSym } from "./Symbols.js";
import { CachableData, CacheData } from "./decorators/Cacheable.js";
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
    if (meta.cacheEvict != null && meta.cacheEvict.length > 0) {
      this.handleCacheEvict(meta, args);
    }
    if (meta.cacheables != null && meta.cacheables.length > 0) {
      return this.handleSyncCachable(meta, args, originalFunction);
    }
    return;
  }

  private async asyncWrapper(
    meta: CacheData,
    args: any[],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    originalFunction: Function,
  ): Promise<any> {
    if (meta.cacheEvict != null && meta.cacheEvict.length > 0) {
      this.handleCacheEvict(meta, args);
    }
    if (meta.cacheables != null && meta.cacheables.length > 0) {
      return await this.handleAsyncCachable(meta, args, originalFunction);
    }
    return;
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    originalFunction: Function,
  ): any {
    if (meta.cacheables == null || meta.cacheables.length === 0) {
      return;
    }
    const key1 = meta.cacheables[0].keyGen(args);
    const cache1 = this.getCache(meta.cacheables[0]);

    const valueWrapper = cache1?.get(key1);
    if (valueWrapper == null) {
      const result = originalFunction(...args);
      for (const cacheable of meta.cacheables) {
        const key = cacheable.keyGen(args);
        const cache = this.getCache(cacheable);
        cache?.put(key, result);
      }
      return result;
    } else {
      return valueWrapper.value;
    }
  }

  private async handleAsyncCachable(
    meta: CacheData,
    args: any[],
    originalFunction,
  ): Promise<any> {
    if (meta.cacheables == null || meta.cacheables.length === 0) {
      return;
    }
    const key1 = meta.cacheables[0].keyGen(args);
    const cache1 = this.getCache(meta.cacheables[0]);

    const valueWrapper = cache1?.get(key1);
    if (valueWrapper == null) {
      const result = await originalFunction(...args);
      for (const cacheable of meta.cacheables) {
        const key = cacheable.keyGen(args);
        const cache = this.getCache(cacheable);
        cache?.put(key, result);
      }
      return result;
    } else {
      return valueWrapper.value;
    }
  }

  private getCache(cacheable: CachableData) {
    return this.#cacheManager.getCache(cacheable.cacheName);
  }
}
