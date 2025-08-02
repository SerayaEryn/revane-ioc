import { BeanFactoryPreProcessor } from "../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js";
import {
  configurationPropertiesSym,
  constructorBindingSym,
} from "./Symbols.js";
import { BeanDefinition } from "../revane-ioc-core/BeanDefinition.js";
import { getMetadata } from "../revane-utils/Metadata.js";
import { DependencyDefinition } from "../revane-ioc-core/dependencies/DependencyDefinition.js";
import { RevaneConfiguration } from "./RevaneConfiguration.js";

export class ConfigurationPropertiesPreProcessor
  implements BeanFactoryPreProcessor
{
  #configuration: RevaneConfiguration;

  constructor(configuration: RevaneConfiguration) {
    this.#configuration = configuration;
  }

  async preProcess(beanDefinition: BeanDefinition): Promise<BeanDefinition[]> {
    if (beanDefinition.classConstructor != null) {
      const configurationProperties = getMetadata(
        configurationPropertiesSym,
        beanDefinition.classConstructor,
      );
      const constructorBinding: Record<string, string[]> = getMetadata(
        constructorBindingSym,
        beanDefinition.classConstructor,
      );
      if (constructorBinding != null && configurationProperties != null) {
        console.log(constructorBinding);
        beanDefinition.dependencyIds =
          constructorBinding.constructorParameterNames.map((it) => {
            const value = this.#configuration.getOrElse(
              `${configurationProperties.prefix}.${it}`,
              null,
            );
            return new DependencyDefinition("value", value, null);
          });
      } else {
        beanDefinition.configurationProperties = configurationProperties;
      }
    }
    return [beanDefinition];
  }
}
