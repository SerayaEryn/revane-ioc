import {
  Loader,
  LoaderOptions,
  BeanDefinition,
  DefaultBeanDefinition,
} from "../revane-ioc/RevaneIOC.js";
import { DefaultLogFactory } from "./DefaultLogFactory.js";

export class LoggingLoader implements Loader {
  private readonly logFactory: DefaultLogFactory;

  constructor(logFactory: DefaultLogFactory) {
    this.logFactory = logFactory;
  }

  async load(_options: LoaderOptions[]): Promise<BeanDefinition[]> {
    const beanDefinition = new DefaultBeanDefinition("logFactory");
    beanDefinition.scope = "singleton";
    beanDefinition.instance = this.logFactory;
    return [beanDefinition];
  }

  type(): string {
    return "logging";
  }
}
