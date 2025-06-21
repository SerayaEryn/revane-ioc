import { RevaneConfiguration } from "../../revane-configuration/RevaneConfiguration.js";
import { BeanDefinition } from "../../revane-ioc-core/BeanDefinition.js";
import { BeanFactoryPreProcessor } from "../../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js";
import { getMetadata } from "../../revane-utils/Metadata.js";
import { conditionalSym } from "../Symbols.js";
import { ConditionDefinition } from "./Conditional.js";

export class ConditionalBeanFactoryPreProcessor
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
    const conditions: ConditionDefinition[] | null = getMetadata(
      conditionalSym,
      classConstructor,
    );
    if (conditions == null || conditions.length === 0) {
      return [beanDefinition];
    }
    for (const condition of conditions) {
      const conditionInstance = new condition.conditionClass(
        this.#configuration,
      );
      if (!(await conditionInstance.matches(condition.data))) {
        return [];
      }
    }
    return [beanDefinition];
  }
}
