import { LoadingStrategy } from "./loading/LoadingStrategy.js";
import { Configuration } from "./Configuration.js";
import { NoConfigFilesFound } from "./NoConfigFilesFound.js";
import { KeyNotPresentInConfig } from "./KeyNotPresentInConfig.js";
import { TypeMismatch } from "./TypeMismatch.js";
import { deepMerge } from "../revane-utils/Deepmerge.js";
import { ConfigurationExtension } from "./ConfigurationExtension.js";
import { ConfigurationProperties } from "./ConfigurationProperties.js";

export class ConfigurationOptions {
  profile: string | null;
  directory: string;
  required: boolean;
  disabled: boolean;
  strategies: LoadingStrategy[];
  basePackage: string;

  constructor(
    profile: string | null,
    directory: string,
    required: boolean,
    disabled: boolean,
    strategies: LoadingStrategy[],
    basePackage: string,
  ) {
    this.profile = profile;
    this.directory = directory;
    this.required = required || false;
    this.disabled = disabled ?? false;
    this.strategies = strategies;
    this.basePackage = basePackage;
  }
}

const BASE_PACKAGE = "revane.basePackage";
const PROFILE = "revane.profile";
const ORIGINAL_PROFILE = "revane.original-profile";
const FAVICON_ENABLED = "revane.favicon.enabled";
const DEFAULT_PROFILE = "default";

export {
  ConfigurationExtension,
  ConfigurationProperties,
  BASE_PACKAGE,
  PROFILE,
  ORIGINAL_PROFILE,
  FAVICON_ENABLED,
};

export class RevaneConfiguration implements Configuration {
  private values: object = {};
  private readonly options: ConfigurationOptions;

  constructor(options: ConfigurationOptions) {
    this.options = options;
  }

  public async init(): Promise<void> {
    this.put(ORIGINAL_PROFILE, this.options.profile);
    this.put(PROFILE, this.options.profile ?? DEFAULT_PROFILE);
    this.put(BASE_PACKAGE, this.options.basePackage);
    if (!this.options.disabled) {
      await this.loadConfigFiles();
    }
    if (!this.has(FAVICON_ENABLED)) {
      this.put(FAVICON_ENABLED, true);
    }
  }

  public put(key: string, value: any): void {
    const parts = key.split(".");
    let values = this.values;
    for (let index = 0; index < parts.length; index++) {
      if (index === parts.length - 1) {
        values[parts[index]] = value;
      } else {
        if (values[parts[index]] == null) {
          values[parts[index]] = {};
        }
        values = values[parts[index]];
      }
    }
  }

  public get(key: string): any {
    const parts = key.split(".");
    let values = this.values;
    for (const part of parts) {
      if (values == null) {
        throw new KeyNotPresentInConfig(key);
      }
      values = values[part];
    }
    return values;
  }

  public getString(key: string): string {
    const value = this.get(key);
    if (typeof value !== "string") {
      throw new TypeMismatch(key, "string");
    }
    return value;
  }

  public getBoolean(key: string): boolean {
    const value = this.get(key);
    if (typeof value !== "boolean") {
      throw new TypeMismatch(key, "boolean");
    }
    return value;
  }

  public getBooleanOrElse(key: string, fallback: boolean): boolean {
    if (!this.has(key)) {
      return fallback;
    }
    return this.getBoolean(key);
  }

  public getNumber(key: string): number {
    const value = this.get(key);
    if (typeof value !== "number") {
      throw new TypeMismatch(key, "number");
    }
    return value;
  }

  public has(key: string): boolean {
    const parts = key.split(".");
    let values = this.values;
    for (const part of parts) {
      if (values == null) {
        return false;
      }
      values = values[part];
    }
    return values != null;
  }

  private async loadConfigFiles() {
    const profile = this.getString(PROFILE);
    for (const strategy of this.options.strategies) {
      let loadedValues: object = {};
      try {
        const { directory: configDirectory } = this.options;
        loadedValues = await strategy.load(configDirectory, profile);
        this.values = deepMerge(this.values, loadedValues);
        loadedValues = {};
      } catch (error) {
        if (error.code !== "REV_ERR_CONFIG_FILE_NOT_FOUND") {
          throw error;
        }
      }
    }
    if (this.options.required) {
      throw new NoConfigFilesFound();
    }
  }
}
