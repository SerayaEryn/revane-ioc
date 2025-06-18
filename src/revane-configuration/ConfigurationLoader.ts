import {
  Loader,
  LoaderOptions,
  BeanDefinition,
} from "../revane-ioc/RevaneIOC.js";
import DefaultBeanDefinition from "../revane-ioc-core/DefaultBeanDefinition.js";
import { RevaneConfiguration } from "./RevaneConfiguration.js";

export class ConfigurationLoader implements Loader {
  #configuration: RevaneConfiguration;

  constructor(configuration: RevaneConfiguration) {
    this.#configuration = configuration;
  }

  public async load(_: LoaderOptions[]): Promise<BeanDefinition[]> {
    const configuration = new DefaultBeanDefinition("configuration");
    configuration.instance = this.#configuration;
    configuration.scope = "singleton";
    return [configuration];
  }

  public type(): string {
    return "configuration";
  }
}
