import { Cache } from "./Cache.js";

export class CacheManager {
  #caches = new Map<string, Cache>();

  constructor() {}

  setCaches(caches: Cache[]) {
    const cacheMap = new Map<string, Cache>();
    for (const cache of caches) {
      cacheMap.set(cache.getName(), cache);
    }
    this.#caches = cacheMap;
  }

  getCache(name: string): Cache | null {
    return this.#caches.get(name) ?? null;
  }
}
