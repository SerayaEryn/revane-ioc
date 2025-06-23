import { BeanFactoryPreProcessor } from "../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js";
import { BeanDefinition } from "../revane-ioc-core/BeanDefinition.js";
import { BeanAnnotationBeanDefinition } from "./BeanAnnotationBeanDefinition.js";
import { beansSym } from "./Symbols.js";
import { DependencyDefinition } from "../revane-ioc-core/dependencies/DependencyDefinition.js";
import { getMetadata } from "../revane-utils/Metadata.js";
import { AliasBeanDefinition } from "./AliasBeanDefinition.js";

interface BeanFactory {
  id: string;
  aliasIds: string[];
  type: string;
  propertyKey: string;
}

export class BeanAnnotationBeanFactoryPreProcessor
  implements BeanFactoryPreProcessor
{
  async preProcess(
    beanDefinition: BeanDefinition,
    _: BeanDefinition[],
  ): Promise<BeanDefinition[]> {
    const { classConstructor } = beanDefinition;
    let beans: BeanFactory[] =
      classConstructor != null
        ? (getMetadata(beansSym, classConstructor) ?? [])
        : [];
    if (beanDefinition.instance?.constructor != null) {
      beans = beans.concat(
        getMetadata(beansSym, beanDefinition.instance.constructor) ?? [],
      );
    }
    const createdBeans: BeanDefinition[] = [beanDefinition];
    for (const beanFactory of beans) {
      const id = beanFactory.id;
      const beanDefinition2: BeanDefinition = new BeanAnnotationBeanDefinition(
        id,
        beanFactory.propertyKey,
      );
      beanDefinition2.type = beanFactory.type;
      beanDefinition2.scope = "singleton";
      beanDefinition2.dependencyIds = [
        new DependencyDefinition("bean", beanDefinition.id, null),
      ];
      createdBeans.push(beanDefinition2);
      for (const aliasId of beanFactory.aliasIds) {
        createdBeans.push(new AliasBeanDefinition(aliasId, id));
      }
    }
    return createdBeans;
  }
}
