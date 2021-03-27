import CoreOptions, { LoaderOptions } from '../revane-ioc-core/Options'
import { Scope } from '../revane-ioc-core/Scope'
import ComponentScanLoader from './loaders/ComponentScanLoader'
import JsonFileLoader from './loaders/JsonFileLoader'
import XmlFileLoader from './loaders/XmlFileLoader'
import Options from './Options'
import UnknownEndingError from './UnknownEndingError'

export class CoreOptionsBuilder {
  private readonly isLoggingEnabled: boolean

  constructor (isLoggingEnabled: boolean) {
    this.isLoggingEnabled = isLoggingEnabled
  }

  public prepareCoreOptions (options: Options): CoreOptions {
    const coreOptions: CoreOptions = new CoreOptions()
    coreOptions.loaderOptions = options.loaderOptions ?? []
    this.checkForUnknownEndings(coreOptions.loaderOptions)

    if (!(options.configuration?.disabled ?? false)) {
      coreOptions.loaderOptions.push({ file: 'config' })
    }
    if (this.isLoggingEnabled) {
      coreOptions.loaderOptions.push({ file: 'logging' })
    }
    for (const extension of options.extensions) {
      for (const loaderOption of extension.loaderOptions()) {
        coreOptions.loaderOptions.push(loaderOption)
      }
    }
    if (options.autoConfiguration === true) {
      coreOptions.loaderOptions.push({
        componentScan: true,
        basePackage: options.basePackage
      })
    }
    coreOptions.defaultScope = Scope.SINGLETON
    coreOptions.basePackage = options.basePackage
    coreOptions.noRedefinition = options.noRedefinition
    return coreOptions
  }

  private checkForUnknownEndings (files: LoaderOptions[]): void {
    const loaders = [
      new XmlFileLoader(), new JsonFileLoader(), new ComponentScanLoader()
    ]
    for (const file of files) {
      const relevant: boolean[] = []
      for (const loader of loaders) {
        relevant.push(loader.isRelevant(file))
      }
      if (!relevant.includes(true)) {
        throw new UnknownEndingError()
      }
    }
  }
}
