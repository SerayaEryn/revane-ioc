import { LogFactory } from "./LogFactory.js";
import {
  createLogger,
  ConsoleTransport,
  Logger,
  SimpleFormat,
  Transport,
  JsonFormat,
} from "apheleia";
import { LoggingOptions } from "./LoggingOptions.js";
import { createWriteStream } from "node:fs";
import { join } from "node:path";
import { Bean } from "../revane-ioc/RevaneIOC.js";

export class DefaultLogFactory implements LogFactory {
  readonly #rootLogger: Logger;

  constructor(private readonly options: LoggingOptions) {
    this.#rootLogger = createLogger({
      transports: this.#transports(),
      level: options.rootLevel,
    });
  }

  public getInstance(id: string): Logger {
    const logger = this.#rootLogger.child({ beanId: id });
    logger.setLevel(this.options.levels[id] ?? this.options.rootLevel);
    return logger;
  }

  @Bean
  public rootLogger(): Logger {
    return this.#rootLogger;
  }

  #transports(): Transport[] {
    const { file, path, basePackage } = this.options;
    const format =
      this.options.format === "JSON" ? new JsonFormat() : new SimpleFormat();
    const transports = [new ConsoleTransport({ format } as any)];
    if (file != null) {
      transports.push(this.#transportFromFile(file, basePackage));
    }
    if (path != null) {
      transports.push(this.#transportFromPath(path, basePackage));
    }
    return transports;
  }

  #transportFromFile(file: string, basePackage: string): Transport {
    const path = this.#isRelative(file) ? join(basePackage, file) : file;
    const format =
      this.options.format === "JSON" ? new JsonFormat() : new SimpleFormat();
    return new Transport({
      stream: createWriteStream(path),
      format,
    });
  }

  #transportFromPath(path: string, basePackage: string): Transport {
    const absolutePath = this.#absolutePath(path, basePackage);
    const format =
      this.options.format === "JSON" ? new JsonFormat() : new SimpleFormat();
    return new Transport({
      stream: createWriteStream(absolutePath),
      format,
    });
  }

  #absolutePath(path: string, basePackage: string): string {
    if (this.#isRelative(path)) {
      return join(basePackage, path, "revane.log");
    } else {
      return join(path, "revane.log");
    }
  }

  #isRelative(file: string): boolean {
    return !file.startsWith("/");
  }
}
