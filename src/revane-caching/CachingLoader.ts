import {
  Loader,
  LoaderOptions,
  BeanDefinition,
  DefaultBeanDefinition,
} from "../revane-ioc/RevaneIOC.js";
import { CacheManager } from "./CacheManager.js";

export class CachingLoader implements Loader {
  #cacheManager: CacheManager;

  constructor(cacheManager: CacheManager) {
    this.#cacheManager = cacheManager;
  }

  async load(_options: LoaderOptions[]): Promise<BeanDefinition[]> {
    const beanDefinition = new DefaultBeanDefinition("cacheManager");
    beanDefinition.scope = "singleton";
    beanDefinition.instance = this.#cacheManager;
    beanDefinition.classConstructor = CacheManager;
    return [beanDefinition];
  }

  type(): string {
    return "caching";
  }
}
