import {
    Component,
    SimpleCache,
    CacheManager,
    CachePut
} from "../../src/revane-ioc/RevaneIOC.js";

@Component
export class CacheMe5 {
    value = 0

    constructor(cacheManager: CacheManager) {
        cacheManager.setCaches([new SimpleCache("TEST")])
    }

    @CachePut("TEST", (it) => it[0])
    cacheMePls(key: string): number {
        return ++this.value
    }
}