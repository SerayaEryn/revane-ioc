import { BeanFactoryPreProcessor } from "../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js";
import { Extension } from "../revane-ioc/Extension.js";
import { RevaneConfiguration } from "../revane-ioc/RevaneIOC.js";
import { ConditionalOnFileBeanFactoryPreProcessor } from "./file/ConditionalOnFileBeanFactoryPreProcessor.js";
import { ConditionalOnMissingBeanBeanFactoryPreProcessor } from "./missing-bean/ConditionalOnMissingBeanBeanFactoryPreProcessor.js";
import { ConditionalOnPropertyBeanFactoryPreProcessor } from "./property/ConditionalOnPropertyBeanFactoryPreProcessor.js";

export class ConditionalExtension extends Extension {
  #configuration: RevaneConfiguration;

  constructor(configuration: RevaneConfiguration) {
    super();
    this.#configuration = configuration;
  }

  public beanFactoryPreProcessors(): BeanFactoryPreProcessor[] {
    return [
      new ConditionalOnMissingBeanBeanFactoryPreProcessor(),
      new ConditionalOnFileBeanFactoryPreProcessor(this.#configuration),
      new ConditionalOnPropertyBeanFactoryPreProcessor(this.#configuration),
    ];
  }
}
