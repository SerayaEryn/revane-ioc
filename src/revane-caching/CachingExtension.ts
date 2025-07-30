import {
  CacheManager,
  Extension,
  Loader,
  BeanFactoryPostProcessor,
} from "../revane-ioc/RevaneIOC.js";
import { CachingLoader } from "./CachingLoader.js";
import { CacheBeanFactoryPostProcessor } from "./CacheBeanFactoryPostProcessor.js";

export class CachingExtension extends Extension {
  #cacheManager: CacheManager;

  constructor() {
    super();
    this.#cacheManager = new CacheManager();
  }

  public beanFactoryPostProcessors(): BeanFactoryPostProcessor[] {
    return [new CacheBeanFactoryPostProcessor(this.#cacheManager)];
  }

  public beanLoaders(): Loader[] {
    return [new CachingLoader(this.#cacheManager)];
  }
}
