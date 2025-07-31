import {Cacheable, CacheEvict, Component, SimpleCache, CacheManager} from "../../src/revane-ioc/RevaneIOC.js";

@Component
export class CacheMe3 {
    value = 0

    constructor(cacheManager: CacheManager) {
        cacheManager.setCaches([new SimpleCache("TEST")])
    }

    @Cacheable("TEST", (it) => it[0])
    cacheMePls(key1: string): number {
        return ++this.value
    }

    @CacheEvict("TEST", (it) => it[0])
    evict(key1: string): void {}
}