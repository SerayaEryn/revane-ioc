import { LoadingStrategy } from "./LoadingStrategy.js";
import { promises } from "fs";
import { ConfigFileNotFound } from "./ConfigFileNotFound.js";
import { replaceEnvironmentVariables } from "./EnvironmentLoader.js";
import { deepMerge } from "../../revane-utils/Deepmerge.js";

const { readFile } = promises;

export class JsonLoadingStrategy implements LoadingStrategy {
  async load(configDirectory: string, profile: string): Promise<object> {
    let buffer1: Buffer;
    const configPath = `${configDirectory}/application.json`;
    try {
      buffer1 = await readFile(configPath);
    } catch (_) {
      throw new ConfigFileNotFound(configPath);
    }
    const defaultConfig: object = JSON.parse(
      replaceEnvironmentVariables(buffer1.toString()),
    );
    let profileConfig: object;
    try {
      const buffer2 = await readFile(
        `${configDirectory}/application-${profile}.json`,
      );
      profileConfig = JSON.parse(
        replaceEnvironmentVariables(buffer2.toString()),
      );
    } catch (_) {
      profileConfig = {};
    }
    return deepMerge(defaultConfig, profileConfig);
  }
}
