import {
  Loader,
  LoaderOptions,
  BeanDefinition,
  DefaultBeanDefinition,
  SINGLETON_VALUE,
} from "../revane-ioc/RevaneIOC.js";
import { DefaultLogFactory } from "./DefaultLogFactory.js";

export class LoggingLoader implements Loader {
  async load(_options: LoaderOptions[]): Promise<BeanDefinition[]> {
    const beanDefinition = new DefaultBeanDefinition("logFactory");
    beanDefinition.scope = SINGLETON_VALUE;
    beanDefinition.classConstructor = DefaultLogFactory;
    beanDefinition.dependencyIds = [];
    return [beanDefinition];
  }

  type(): string {
    return "logging";
  }
}
