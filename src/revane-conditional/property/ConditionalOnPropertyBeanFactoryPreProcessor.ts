import { BeanDefinition } from "../../revane-ioc-core/BeanDefinition.js";
import { BeanFactoryPreProcessor } from "../../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js";
import { conditionalOnPropertySym } from "../Symbols.js";
import { RevaneConfiguration } from "../../revane-ioc/RevaneIOC.js";

export class ConditionalOnPropertyBeanFactoryPreProcessor
  implements BeanFactoryPreProcessor
{
  #configuration: RevaneConfiguration;

  constructor(configuration: RevaneConfiguration) {
    this.#configuration = configuration;
  }

  async preProcess(
    beanDefinition: BeanDefinition,
    _: BeanDefinition[],
  ): Promise<BeanDefinition[]> {
    const classConstructor = beanDefinition.classConstructor;
    if (classConstructor == null) return [beanDefinition];
    const conditionalOnProperty: {
      property: string;
      value: number | boolean | string;
    } = Reflect.getMetadata(conditionalOnPropertySym, classConstructor);
    if (conditionalOnProperty == null) {
      return [beanDefinition];
    }
    if (
      (await this.#configuration.has(conditionalOnProperty.property)) &&
      (await this.#configuration.get(conditionalOnProperty.property)) ==
        conditionalOnProperty.value
    ) {
      return [beanDefinition];
    } else {
      return [];
    }
  }
}
