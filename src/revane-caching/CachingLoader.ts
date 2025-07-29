import {
  Loader,
  LoaderOptions,
  BeanDefinition,
  DefaultBeanDefinition,
} from "../revane-ioc/RevaneIOC.js";
import { CacheManager } from "./CacheManager.js";

export class CachingLoader implements Loader {
  private readonly cacheManager: CacheManager;

  constructor() {
    this.cacheManager = new CacheManager();
  }

  async load(_options: LoaderOptions[]): Promise<BeanDefinition[]> {
    const beanDefinition = new DefaultBeanDefinition("cacheManager");
    beanDefinition.scope = "singleton";
    beanDefinition.instance = this.cacheManager;
    return [beanDefinition];
  }

  type(): string {
    return "caching";
  }
}
