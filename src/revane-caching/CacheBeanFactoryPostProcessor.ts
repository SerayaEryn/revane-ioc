import {
  BeanDefinition,
  BeanFactoryPostProcessor,
} from "../revane-ioc/RevaneIOC.js";
import Bean from "../revane-ioc-core/context/bean/Bean.js";
import { getMetadata } from "../revane-utils/Metadata.js";
import { cachableSym } from "./Symbols.js";
import { CachableData, CacheData } from "./Cacheable.js";
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
      const meta: CacheData = getMetadata(
        cachableSym,
        beanDefinition.classConstructor.prototype,
      );
      if (meta == null) {
        return;
      }
      const methodName = meta.methodName;
      const originalFunction = instance[methodName].bind(instance);
      if (isAsyncFunction(instance[methodName])) {
        instance[methodName] = async (...args: any[]) => {
          if (meta.cacheables.length === 0) {
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
        };
      } else {
        instance[methodName] = (...args: any[]) => {
          if (meta.cacheables.length === 0) {
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
        };
      }
    }
  }
  private getCache(cacheable: CachableData) {
    return this.#cacheManager.getCache(cacheable.cacheName);
  }
}
