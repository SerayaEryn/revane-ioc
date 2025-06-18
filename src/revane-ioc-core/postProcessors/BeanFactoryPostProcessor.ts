import Bean from "../context/bean/Bean.js";
import { BeanDefinition } from "../BeanDefinition.js";

export interface BeanFactoryPostProcessor {
  postProcess: (
    beanDefinition: BeanDefinition,
    bean: Bean,
    instance: any,
  ) => Promise<void>;
}
