import { BeanFactoryPreProcessor } from "../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js";
import { Extension } from "../revane-ioc/Extension.js";
import { ConditionalOnFileBeanFactoryPreProcessor } from "./file/ConditionalOnFileBeanFactoryPreProcessor.js";
import { ConditionalOnMissingBeanBeanFactoryPreProcessor } from "./missing-bean/ConditionalOnMissingBeanBeanFactoryPreProcessor.js";

export class ConditionalExtension extends Extension {
  #basePackage: string;

  constructor(basePackage: string) {
    super();
    this.#basePackage = basePackage;
  }

  public beanFactoryPreProcessors(): BeanFactoryPreProcessor[] {
    return [
      new ConditionalOnMissingBeanBeanFactoryPreProcessor(),
      new ConditionalOnFileBeanFactoryPreProcessor(this.#basePackage),
    ];
  }
}
