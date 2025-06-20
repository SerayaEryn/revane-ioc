import { join } from "node:path";
import {
  BASE_PACKAGE,
  RevaneConfiguration,
} from "../../revane-configuration/RevaneConfiguration.js";
import { Condition } from "../conditional/Condition.js";
import { access, constants } from "node:fs/promises";

export class ResourceCondition implements Condition {
  #basePackage: string;

  constructor(configuration: RevaneConfiguration) {
    this.#basePackage = configuration.getString(BASE_PACKAGE);
  }

  async matches(data: { file: string }): Promise<boolean> {
    return this.#fileExists(data.file);
  }

  async #fileExists(file: string): Promise<boolean> {
    try {
      await access(join(this.#basePackage, file), constants.R_OK);
      return true;
    } catch (_) {
      return false;
    }
  }
}
