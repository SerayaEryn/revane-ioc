import { BeanDefinition, Loader, LoaderOptions } from "./RevaneIOC.js";

export class SingleBeanLoader implements Loader {
  #beanDefinition: BeanDefinition;

  constructor(beanDefinition: BeanDefinition) {
    this.#beanDefinition = beanDefinition;
  }

  public async load(_: LoaderOptions[]): Promise<BeanDefinition[]> {
    return [this.#beanDefinition];
  }

  public type(): string {
    return "single-bean";
  }
}
