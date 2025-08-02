import { RevaneConfiguration } from "../../revane-configuration/RevaneConfiguration.js";
import { Condition } from "../RevaneConditional.js";

export class PropertyCondition implements Condition {
  #configuration: RevaneConfiguration;

  constructor(configuration: RevaneConfiguration) {
    this.#configuration = configuration;
  }

  async matches(data: {
    value: string | number | boolean;
    property: string;
    matchIfMissing?: boolean;
  }): Promise<boolean> {
    if (this.#configuration.has(data.property)) {
      return this.#configuration.get(data.property) == data.value;
    } else {
      return data.matchIfMissing ?? false;
    }
  }
}
