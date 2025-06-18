import { BeanFactoryPostProcessor } from "../revane-ioc-core/postProcessors/BeanFactoryPostProcessor.js";
import { Extension } from "../revane-ioc/Extension.js";
import { LifeCycleBeanFactoryPostProcessor } from "./LifeCycleBeanFactoryPostProcessor.js";

export class LifeCycleExtension extends Extension {
  public beanFactoryPostProcessors(): BeanFactoryPostProcessor[] {
    return [new LifeCycleBeanFactoryPostProcessor()];
  }
}
