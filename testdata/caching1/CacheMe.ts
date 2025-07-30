import {Cacheable, Component, SimpleCache, CacheManager} from "../../src/revane-ioc/RevaneIOC.js";

@Component
export class CacheMe {
    value = 0

    constructor(cacheManager: CacheManager) {
        cacheManager.setCaches([new SimpleCache("TEST")])
    }

    @Cacheable("TEST", (it) => it[0])
    cacheMePls(key: string): number {
        return ++this.value
    }
}