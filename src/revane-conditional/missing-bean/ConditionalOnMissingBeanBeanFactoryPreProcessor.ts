import { BeanFactoryPreProcessor } from "../../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js";
import { BeanDefinition } from "../../revane-ioc-core/BeanDefinition.js";
import { conditionalOnMissingBeanSym } from "../Symbols.js";

export class ConditionalOnMissingBeanBeanFactoryPreProcessor
  implements BeanFactoryPreProcessor
{
  public async preProcess(
    beanDefinition: BeanDefinition,
    beanDefinitions: BeanDefinition[],
  ): Promise<BeanDefinition[]> {
    const classConstructor = beanDefinition.classConstructor;
    if (classConstructor == null) return [beanDefinition];
    const conditionalOnMissingBean = Reflect.getMetadata(
      conditionalOnMissingBeanSym,
      classConstructor,
    );
    if (conditionalOnMissingBean === true) {
      const beanIsMissing =
        beanDefinitions
          .filter((it) => it.uid !== beanDefinition.uid)
          .filter((it) => it.id === beanDefinition.id).length === 0;
      if (beanIsMissing) {
        return [beanDefinition];
      } else {
        return [];
      }
    }
    return [beanDefinition];
  }
}
