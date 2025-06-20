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
  }): Promise<boolean> {
    return (
      (await this.#configuration.has(data.property)) &&
      (await this.#configuration.get(data.property)) == data.value
    );
  }
}
