import { BeanFactoryPreProcessor } from "../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js";
import { BeanDefinition } from "../revane-ioc-core/BeanDefinition.js";
import { BeanAnnotationBeanDefinition } from "./BeanAnnotationBeanDefinition.js";
import { beansSym } from "./Symbols.js";
import { DependencyDefinition } from "../revane-ioc-core/dependencies/DependencyDefinition.js";
import "reflect-metadata/lite";

export class BeanAnnotationBeanFactoryPreProcessor
  implements BeanFactoryPreProcessor
{
  async preProcess(
    beanDefinition: BeanDefinition,
    _: BeanDefinition[],
  ): Promise<BeanDefinition[]> {
    const classConstructor = beanDefinition.classConstructor;
    let beans =
      classConstructor?.prototype != null
        ? (Reflect.getMetadata(beansSym, classConstructor.prototype) ?? [])
        : [];
    if (beanDefinition.instance?.constructor?.prototype != null) {
      beans = beans.concat(
        Reflect.getMetadata(
          beansSym,
          beanDefinition.instance.constructor.prototype,
        ) ?? [],
      );
    }
    const createdBeans: BeanDefinition[] = [beanDefinition];
    for (const beanFactory of beans) {
      const beanDefinition2: BeanDefinition = new BeanAnnotationBeanDefinition(
        beanFactory.id,
        beanFactory.propertyKey,
      );
      beanDefinition2.type = beanFactory.type;
      beanDefinition2.scope = "singleton";
      beanDefinition2.dependencyIds = [
        new DependencyDefinition("bean", beanDefinition.id, null),
      ];
      createdBeans.push(beanDefinition2);
    }
    return createdBeans;
  }
}
