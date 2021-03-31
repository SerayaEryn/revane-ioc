import { RevaneConfiguration } from '../revane-configuration/RevaneConfiguration'
import Loader from '../revane-ioc-core/Loader'
import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import { Extension } from '../revane-ioc/Extension'
import { LoggingLoader } from './LoggingLoader'
import { LoggingOptions } from './LoggingOptions'

export class LoggingExtension implements Extension {
  private enabled = true
  private options: LoggingOptions

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
    this.options = new LoggingOptions(
      rootLevel,
      levels,
      configuration.getString('revane.basePackage'),
      file,
      path
    )
    const loggingEnabled = configuration.has('revane.logging.enabled')
    if (loggingEnabled && !configuration.getBoolean('revane.logging.enabled')) {
      this.enabled = false
    }
  }

  public beanFactoryPostProcessors (): BeanFactoryPostProcessor[] {
    return []
  }

  public beanLoaders (): Loader[] {
    if (this.enabled) {
      return [new LoggingLoader(this.options)]
    }
    return []
  }

  public async close (): Promise<void> {}
}
