import { BeanFactoryPreProcessor } from "../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js";
import { Extension } from "../revane-ioc/Extension.js";
import { RevaneConfiguration } from "../revane-ioc/RevaneIOC.js";
import { ConditionalBeanFactoryPreProcessor } from "./conditional/ConditionalBeanFactoryPreProcessor.js";
import { ConditionalOnMissingBeanBeanFactoryPreProcessor } from "./missing-bean/ConditionalOnMissingBeanBeanFactoryPreProcessor.js";

export class ConditionalExtension extends Extension {
  #configuration: RevaneConfiguration;

  constructor(configuration: RevaneConfiguration) {
    super();
    this.#configuration = configuration;
  }

  public beanFactoryPreProcessors(): BeanFactoryPreProcessor[] {
    return [
      new ConditionalOnMissingBeanBeanFactoryPreProcessor(),
      new ConditionalBeanFactoryPreProcessor(this.#configuration),
    ];
  }
}
