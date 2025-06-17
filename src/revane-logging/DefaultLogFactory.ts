import { LogFactory } from './LogFactory.js'
import {
  createLogger, ConsoleTransport, Logger, SimpleFormat, Transport, JsonFormat
} from 'apheleia'
import { LoggingOptions } from './LoggingOptions.js'
import { createWriteStream } from 'fs'
import { join } from 'path'
import { Bean } from '../revane-ioc/RevaneIOC.js'

export class DefaultLogFactory implements LogFactory {
  private readonly rootLogger1: Logger

  constructor (private readonly options: LoggingOptions) {
    this.rootLogger1 = createLogger({
      transports: this.transports(),
      level: options.rootLevel
    })
    this.rootLogger1.info('Starting Revane application...')
  }

  public getInstance (id: string): Logger {
    const logger = this.rootLogger1.child({ beanId: id })
    logger.setLevel(this.options.levels[id] ?? this.options.rootLevel)
    return logger
  }

  @Bean
  public rootLogger (): Logger {
    return this.rootLogger1
  }

  private transports (): Transport[] {
    const { file, path, basePackage } = this.options
    const format = this.options.format === 'JSON' ? new JsonFormat() : new SimpleFormat()
    const transports = [
      new ConsoleTransport({ format } as any)
    ]
    if (file != null) {
      transports.push(this.transportFromFile(file, basePackage))
    }
    if (path != null) {
      transports.push(this.transportFromPath(path, basePackage))
    }
    return transports
  }

  private transportFromFile (file: string, basePackage: string): Transport {
    const path = this.isRelative(file) ? join(basePackage, file) : file
    const format = this.options.format === 'JSON' ? new JsonFormat() : new SimpleFormat()
    return new Transport({
      stream: createWriteStream(path),
      format
    })
  }

  private transportFromPath (path: string, basePackage: string): Transport {
    let absolutePath: string
    const format = this.options.format === 'JSON' ? new JsonFormat() : new SimpleFormat()
    if (this.isRelative(path)) {
      absolutePath = join(basePackage, path, 'revane.log')
    } else {
      absolutePath = join(path, 'revane.log')
    }
    return new Transport({
      stream: createWriteStream(absolutePath),
      format
    })
  }

  private isRelative (file: string): boolean {
    return !file.startsWith('/')
  }
}
