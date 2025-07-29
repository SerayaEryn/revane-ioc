import { RevaneConfiguration } from "../revane-configuration/RevaneConfiguration.js";
import Loader from "../revane-ioc-core/Loader.js";
import { Extension } from "../revane-ioc/Extension.js";
import { DependencyResolver } from "../revane-ioc/RevaneIOC.js";
import { LoggerDependencyResolver } from "./LoggerDependencyResolver.js";
import { LoggingLoader } from "./LoggingLoader.js";

export class LoggingExtension extends Extension {
  private enabled: boolean;

  public async initialize(configuration: RevaneConfiguration): Promise<void> {
    this.enabled = configuration.getBooleanOrElse(
      "revane.logging.enabled",
      true,
    );
  }

  public beanLoaders(): Loader[] {
    if (this.enabled) {
      return [new LoggingLoader()];
    }
    return [];
  }

  public dependencyResolvers(): DependencyResolver[] {
    return [new LoggerDependencyResolver()];
  }
}
