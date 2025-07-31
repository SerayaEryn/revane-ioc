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
    fallback?: string | number | boolean;
  }): Promise<boolean> {
    return (
      this.#configuration.getOrElse(data.property, data.fallback ?? null) ==
      data.value
    );
  }
}
