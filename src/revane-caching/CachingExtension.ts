import { Extension, Loader } from "../revane-ioc/RevaneIOC.js";
import { CachingLoader } from "./CachingLoader.js";

export class CachingExtension extends Extension {
  public beanLoaders(): Loader[] {
    return [new CachingLoader()];
  }
}
