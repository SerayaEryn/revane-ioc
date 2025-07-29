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
      Object.keys(values).forEach((index) => {
        const value = values[index];
        beanDefinition.dependencyIds[index] = new DependencyDefinition(
          "value",
          this.#getConfigValue(value.key, value.type, value.default),
          null,
        );
      });
      return [beanDefinition];
    }
    return [beanDefinition];
  }

  #getConfigValue(
    key: string,
    type: "number" | "string" | "boolean" | null | undefined,
    fallback?: any,
  ): number | string | boolean {
    if (fallback !== undefined) {
      switch (type) {
        case "number":
          return this.#configuration.getNumberOrElse(key, fallback);
        case "string":
          return this.#configuration.getStringOrElse(key, fallback);
        case null:
          return this.#configuration.getOrElse(key, fallback);
        case undefined:
          return this.#configuration.getOrElse(key, fallback);
        case "boolean":
          return this.#configuration.getBooleanOrElse(key, fallback);
      }
    }
    switch (type) {
      case "number":
        return this.#configuration.getNumber(key);
      case "string":
        return this.#configuration.getString(key);
      case null:
        return this.#configuration.get(key);
      case undefined:
        return this.#configuration.get(key);
      case "boolean":
        return this.#configuration.getBoolean(key);
    }
  }
}
