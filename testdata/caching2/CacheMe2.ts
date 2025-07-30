import {Cacheable, Component, SimpleCache, CacheManager} from "../../src/revane-ioc/RevaneIOC.js";

@Component
export class CacheMe2 {
    value = 0

    constructor(cacheManager: CacheManager) {
        cacheManager.setCaches([new SimpleCache("TEST1"), new SimpleCache("TEST2")])
    }

    @Cacheable("TEST1", (it) => it[0] + it[1])
    @Cacheable("TEST2", (it) => it[0])
    cacheMePls(key1: string, key2: string): number {
        return ++this.value
    }
}