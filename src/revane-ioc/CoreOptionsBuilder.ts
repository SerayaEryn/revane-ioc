import { ComponentScanLoaderOptions } from "../revane-componentscan/ComponentScanLoaderOptions.js";
import CoreOptions from "../revane-ioc-core/Options.js";
import { Scopes } from "../revane-ioc-core/Scopes.js";
import Options from "./Options.js";
import { RevaneConfiguration } from "./RevaneIOC.js";

const ALLOW_BEAN_REDEFINITION = "revane.main.allow-bean-definition-overriding";

export class CoreOptionsBuilder {
  public prepareCoreOptions(
    options: Options,
    configuration: RevaneConfiguration,
  ): CoreOptions {
    const coreOptions: CoreOptions = new CoreOptions();
    coreOptions.loaderOptions = options.loaderOptions ?? [];
    if (options.autoConfiguration === true) {
      coreOptions.loaderOptions.push(
        new ComponentScanLoaderOptions(options.basePackage, null, null),
      );
    }
    coreOptions.defaultScope = Scopes.SINGLETON;
    coreOptions.basePackage = options.basePackage;
    if (options.noRedefinition != null) {
      coreOptions.noRedefinition = options.noRedefinition;
    } else if (configuration.has(ALLOW_BEAN_REDEFINITION)) {
      const allowRedefinition = configuration.getBoolean(
        ALLOW_BEAN_REDEFINITION,
      );
      coreOptions.noRedefinition = !allowRedefinition;
    } else {
      coreOptions.noRedefinition = true;
    }
    return coreOptions;
  }
}
