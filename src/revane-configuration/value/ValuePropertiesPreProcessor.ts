import { BeanFactoryPreProcessor } from "../../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js";
import { BeanDefinition } from "../../revane-ioc-core/BeanDefinition.js";
import { getMetadata } from "../../revane-utils/Metadata.js";
import { valueSym } from "../Symbols.js";
import { ValueOptions } from "./Value.js";
import { RevaneConfiguration } from "../RevaneConfiguration.js";
import { DependencyDefinition } from "../../revane-ioc-core/dependencies/DependencyDefinition.js";

export class ValuePreProcessor implements BeanFactoryPreProcessor {
  #configuration: RevaneConfiguration;

  constructor(configuration: RevaneConfiguration) {
    this.#configuration = configuration;
  }

  async preProcess(beanDefinition: BeanDefinition): Promise<BeanDefinition[]> {
    if (beanDefinition.classConstructor != null) {
      const values: Map<number, ValueOptions> = getMetadata(
        valueSym,
        beanDefinition.classConstructor,
      );
      if (values == null) {
        return [beanDefinition];
      }
      beanDefinition.dependencyIds = beanDefinition.dependencyIds.map(
        (value, index) => {
          if (values[index] != null) {
            const value = values[index];
            return new DependencyDefinition(
              "value",
              this.#getConfigValue(value.key, value.type),
              null,
            );
          }
          return value;
        },
      );
      return [beanDefinition];
    }
    return [beanDefinition];
  }

  #getConfigValue(
    key: string,
    type: "number" | "string" | "boolean" | null | undefined,
  ): number | string | boolean {
    switch (type) {
      case "number":
        return this.#configuration.getNumber(key);
      case "string":
        return this.#configuration.getString(key);
      case null:
        return this.#configuration.getString(key);
      case undefined:
        return this.#configuration.getString(key);
      case "boolean":
        return this.#configuration.getBoolean(key);
    }
  }
}
