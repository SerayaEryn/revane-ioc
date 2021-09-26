import { RevaneConfiguration } from '../revane-configuration/RevaneConfiguration'
import Loader from '../revane-ioc-core/Loader'
import { Extension } from '../revane-ioc/Extension'
import { DependencyResolver } from '../revane-ioc/RevaneIOC'
import { DefaultLogFactory } from './DefaultLogFactory'
import { LoggerDependencyResolver } from './LoggerDependencyResolver'
import { LoggingLoader } from './LoggingLoader'
import { LoggingOptions } from './LoggingOptions'

export class LoggingExtension extends Extension {
  private enabled = true
  private options: LoggingOptions
  private logFactory: DefaultLogFactory

  public async initialize (configuration: RevaneConfiguration): Promise<void> {
    let rootLevel = 'INFO'
    if (configuration.has('revane.logging.rootLevel')) {
      rootLevel = configuration.getString('revane.logging.rootLevel')
    }
    let levels = {}
    if (configuration.has('revane.logging.level')) {
      levels = configuration.get('revane.logging.level')
    }
    let file: string | null = null
    if (configuration.has('revane.logging.file')) {
      file = configuration.getString('revane.logging.file')
    }
    let path: string | null = null
    if (configuration.has('revane.logging.path')) {
      path = configuration.getString('revane.logging.path')
    }
    let format: 'JSON' | 'SIMPLE' = 'SIMPLE'
    if (configuration.has('revane.logging.format')) {
      format = configuration.getString('revane.logging.format') as 'JSON' | 'SIMPLE'
    }
    this.options = new LoggingOptions(
      rootLevel,
      levels,
      configuration.getString('revane.basePackage'),
      file,
      path,
      format
    )
    const loggingEnabled = configuration.has('revane.logging.enabled')
    if (loggingEnabled && !configuration.getBoolean('revane.logging.enabled')) {
      this.enabled = false
    }
    this.logFactory = new DefaultLogFactory(this.options)
  }

  public beanLoaders (): Loader[] {
    if (this.enabled) {
      return [new LoggingLoader(this.logFactory)]
    }
    return []
  }

  public dependencyResolvers (): DependencyResolver[] {
    return [new LoggerDependencyResolver(this.logFactory)]
  }
}
