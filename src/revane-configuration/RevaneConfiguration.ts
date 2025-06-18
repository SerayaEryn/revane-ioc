import { LoadingStrategy } from "./loading/LoadingStrategy.js";
import { Configuration } from "./Configuration.js";
import { NoConfigFilesFound } from "./NoConfigFilesFound.js";
import { KeyNotPresentInConfig } from "./KeyNotPresentInConfig.js";
import { TypeMismatch } from "./TypeMismatch.js";
import { deepMerge } from "../revane-utils/Deepmerge.js";

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

export class RevaneConfiguration implements Configuration {
  private values: object = {};
  private readonly options: ConfigurationOptions;

  constructor(options: ConfigurationOptions) {
    this.options = options;
  }

  public async init(): Promise<void> {
    this.put("revane.original-profile", this.options.profile);
    this.put("revane.profile", this.options.profile ?? "default");
    this.put("revane.basePackage", this.options.basePackage);
    if (!this.options.disabled) {
      await this.loadConfigFiles();
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
    const profile = this.getString("revane.profile");
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
