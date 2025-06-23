import { BeanDefinition } from "../revane-ioc-core/BeanDefinition.js";
import { BeanFactoryPostProcessor } from "../revane-ioc-core/postProcessors/BeanFactoryPostProcessor.js";
import Bean from "../revane-ioc-core/context/bean/Bean.js";
import { getMetadata } from "../revane-utils/Metadata.js";
import { postConstructSym, preDestroySym } from "./Symbols.js";

export class LifeCycleBeanFactoryPostProcessor
  implements BeanFactoryPostProcessor
{
  async postProcess(
    beanDefinition: BeanDefinition,
    bean: Bean,
    instance: any,
  ): Promise<void> {
    beanDefinition.postConstructKey = this.postConstructKey(instance);
    beanDefinition.preDestroyKey = this.preDestroyKey(instance);
  }

  private postConstructKey(instance: any): string | null {
    return getMetadata(postConstructSym, instance)?.propertyKey;
  }

  private preDestroyKey(instance: any): string | null {
    return getMetadata(preDestroySym, instance)?.propertyKey;
  }
}
