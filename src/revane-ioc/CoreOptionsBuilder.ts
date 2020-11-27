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
    coreOptions.loaderOptions = options.loaderOptions || []
    this.checkForUnknownEndings(options, coreOptions.loaderOptions)

    if (!options.configuration?.disabled) {
      coreOptions.loaderOptions.push({ file: 'config' })
    }
    if (this.isLoggingEnabled) {
      coreOptions.loaderOptions.push({ file: 'logging' })
    }
    coreOptions.loaderOptions.push({ file: 'taskScheduler' })
    if (options.autoConfiguration) {
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

  private checkForUnknownEndings (options: Options, files: LoaderOptions[]): void {
    const loaders = [
      new XmlFileLoader(), new JsonFileLoader(), new ComponentScanLoader()
    ].concat(options.plugins.loaders)
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
