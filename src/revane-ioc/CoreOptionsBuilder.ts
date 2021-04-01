import CoreOptions from '../revane-ioc-core/Options'
import { Scopes } from '../revane-ioc-core/Scopes'
import { ComponentScanLoaderOptions } from './loaders/ComponentScanLoaderOptions'
import Options from './Options'

export class CoreOptionsBuilder {
  public prepareCoreOptions (options: Options): CoreOptions {
    const coreOptions: CoreOptions = new CoreOptions()
    coreOptions.loaderOptions = options.loaderOptions ?? []
    if (options.autoConfiguration === true) {
      coreOptions.loaderOptions.push(
        new ComponentScanLoaderOptions(options.basePackage, null, null)
      )
    }
    coreOptions.defaultScope = Scopes.SINGLETON
    coreOptions.basePackage = options.basePackage
    coreOptions.noRedefinition = options.noRedefinition
    return coreOptions
  }
}
