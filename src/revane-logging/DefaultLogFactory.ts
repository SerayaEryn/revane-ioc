import { LogFactory } from './LogFactory'
import {
  createLogger, ConsoleTransport, Logger, SimpleFormat, Transport
} from 'apheleia'
import { LoggingOptions } from './LoggingOptions'
import { createWriteStream } from 'fs'
import { join } from 'path'
import { Parser } from 'acorn'
import * as classFields from 'acorn-class-fields'

type Class = new(...args: any[]) => any

export class DefaultLogFactory implements LogFactory {
  private readonly rootLogger: Logger

  constructor (private readonly options: LoggingOptions) {
    this.options = options
    this.rootLogger = createLogger({
      transports: this.transports(),
      level: options.rootLevel
    })
    this.rootLogger.info(JSON.stringify(options))
    this.rootLogger.info('Starting Revane application...')
  }

  public getInstance (clazz: Class): Logger {
    const className = clazz.constructor.name
    const id = getId(getSyntaxTree(clazz))
    const logger = this.rootLogger.child({ className })
    logger.setLevel(this.options.levels[id] || this.options.rootLevel)
    return logger
  }

  private transports (): Transport[] {
    const { file, path, basePackage } = this.options
    const transports = [
      new ConsoleTransport({
        format: new SimpleFormat()
      } as any)
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
    return new Transport({
      stream: createWriteStream(path),
      format: new SimpleFormat()
    })
  }

  private transportFromPath (path: string, basePackage: string): Transport {
    let absolutePath: string
    if (this.isRelative(path)) {
      absolutePath = join(basePackage, path, 'revane.log')
    } else {
      absolutePath = join(path, 'revane.log')
    }
    return new Transport({
      stream: createWriteStream(absolutePath),
      format: new SimpleFormat()
    })
  }

  private isRelative (file: string): boolean {
    return !file.startsWith('/')
  }
}

function getSyntaxTree (Class): any {
  const functionAsString = Class.toString()
  return Parser.extend(classFields).parse(functionAsString)
}

function getId (tree): string {
  const className: string = tree.body[0].id.name
  return className.substring(0, 1).toLowerCase() + className.substring(1)
}
