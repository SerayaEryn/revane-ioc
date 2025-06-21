import { setMetadata } from "../revane-utils/Metadata.js";
import { configurationPropertiesSym } from "./Symbols.js";
import { Parser } from "acorn";

export interface ConfigurationPropertiesOptions {
  prefix: string;
}

function ConfigurationProperties(options: ConfigurationPropertiesOptions) {
  return function define(target, context?: ClassDecoratorContext) {
    const tree = getSyntaxTree(target);
    const properties: string[] = tree.body[0].body.body
      .filter((node) => node.type === "PropertyDefinition")
      .map((node) => node.key.name);
    const setters: string[] = tree.body[0].body.body
      .filter((node) => node.type === "MethodDefinition")
      .map((node) => node.key.name);
    setMetadata(
      configurationPropertiesSym,
      new ConfigurationPropertiesData(options.prefix, properties, setters),
      target,
      context,
    );
    return target;
  };
}

export class ConfigurationPropertiesData {
  public prefix: string;
  public properties: string[];

  constructor(
    prefix: string,
    properties: string[],
    public setters: string[],
  ) {
    this.prefix = prefix;
    this.properties = properties;
  }
}

function getSyntaxTree(Class): any {
  const functionAsString = Class.toString();
  return Parser.parse(functionAsString, { ecmaVersion: 2023 });
}

export { ConfigurationProperties };
