import { Extension } from "./Extension.js";
import { BeanDefinition, Loader } from "./RevaneIOC.js";
import { SingleBeanLoader } from "./SingleBeanLoader.js";

export class SingleBeanExtension extends Extension {
  #beanDefinition: BeanDefinition;

  constructor(beanDefinition: BeanDefinition) {
    super();
    this.#beanDefinition = beanDefinition;
  }

  public beanLoaders(): Loader[] {
    return [new SingleBeanLoader(this.#beanDefinition)];
  }
}
