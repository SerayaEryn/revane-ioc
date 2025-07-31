import {Cacheable, Component, SimpleCache, CacheManager, CacheEvictAll} from "../../src/revane-ioc/RevaneIOC.js";

@Component
export class CacheMe4 {
    value = 0

    constructor(cacheManager: CacheManager) {
        cacheManager.setCaches([new SimpleCache("TEST")])
    }

    @Cacheable("TEST", (it) => it[0])
    cacheMePls(key: string): number {
        return ++this.value
    }

    @CacheEvictAll("TEST")
    evictAll() {}
}