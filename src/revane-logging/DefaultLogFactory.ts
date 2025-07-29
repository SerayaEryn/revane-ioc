import { LogFactory } from "./LogFactory.js";
import {
  createLogger,
  ConsoleTransport,
  Logger,
  SimpleFormat,
  Transport,
  JsonFormat,
} from "apheleia";
import { createWriteStream } from "node:fs";
import { join } from "node:path";
import { Bean, Value } from "../revane-ioc/RevaneIOC.js";

export class DefaultLogFactory implements LogFactory {
  readonly #rootLogger: Logger;

  constructor(
    @Value({ key: "revane.logging.rootLevel", type: "string", default: "INFO" })
    private level: string,
    @Value({ key: "revane.logging.level", default: {} })
    private levels: Record<string, string>,
    @Value({ key: "revane.logging.file", type: "string", default: null })
    private file: string,
    @Value({ key: "revane.logging.path", type: "string", default: null })
    private path: string,
    @Value({ key: "revane.logging.format", type: "string", default: "SIMPLE" })
    private format: "JSON" | "SIMPLE",
    @Value({ key: "revane.basePackage", type: "string" })
    private basePackage: string,
  ) {
    this.#rootLogger = createLogger({
      transports: this.#transports(),
      level,
    });
  }

  public getInstance(id: string): Logger {
    const logger = this.#rootLogger.child({ beanId: id });
    logger.setLevel(this.levels[id] ?? this.level);
    return logger;
  }

  @Bean
  public rootLogger(): Logger {
    return this.#rootLogger;
  }

  #transports(): Transport[] {
    const format =
      this.format === "JSON" ? new JsonFormat() : new SimpleFormat();
    const transports = [new ConsoleTransport({ format } as any)];
    if (this.file != null) {
      transports.push(this.#transportFromFile(this.file, this.basePackage));
    }
    if (this.path != null) {
      transports.push(this.#transportFromPath(this.path, this.basePackage));
    }
    return transports;
  }

  #transportFromFile(file: string, basePackage: string): Transport {
    const path = this.#isRelative(file) ? join(basePackage, file) : file;
    const format =
      this.format === "JSON" ? new JsonFormat() : new SimpleFormat();
    return new Transport({
      stream: createWriteStream(path),
      format,
    });
  }

  #transportFromPath(path: string, basePackage: string): Transport {
    const absolutePath = this.#absolutePath(path, basePackage);
    const format =
      this.format === "JSON" ? new JsonFormat() : new SimpleFormat();
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
