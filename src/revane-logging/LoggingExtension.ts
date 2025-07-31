import Loader from "../revane-ioc-core/Loader.js";
import { Extension } from "../revane-ioc/Extension.js";
import { DependencyResolver } from "../revane-ioc/RevaneIOC.js";
import { LoggerDependencyResolver } from "./LoggerDependencyResolver.js";
import { LoggingLoader } from "./LoggingLoader.js";

export class LoggingExtension extends Extension {
  public beanLoaders(): Loader[] {
    return [new LoggingLoader()];
  }

  public dependencyResolvers(): DependencyResolver[] {
    return [new LoggerDependencyResolver()];
  }
}
