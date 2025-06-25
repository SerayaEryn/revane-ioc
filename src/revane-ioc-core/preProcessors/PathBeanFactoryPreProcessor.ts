import { BeanFactoryPreProcessor } from "./BeanFactoryPreProcessor.js";
import DefaultBeanDefinition from "../DefaultBeanDefinition.js";
import Options from "../Options.js";
import { join } from "node:path";

export class PathBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  readonly #options: Options;

  constructor(options: Options) {
    this.#options = options;
  }

  public async preProcess(
    beanDefinition: DefaultBeanDefinition,
  ): Promise<DefaultBeanDefinition[]> {
    if (beanDefinition.class != null) {
      beanDefinition.path = this.#getPath(beanDefinition);
    }
    return [beanDefinition];
  }

  #getPath(beanDefinition: DefaultBeanDefinition): string {
    if (!this.#isRelative(beanDefinition) || this.#isAbsolute(beanDefinition)) {
      return beanDefinition.class;
    }
    return join(this.#options.basePackage, beanDefinition.class);
  }

  #isAbsolute(beanDefinition: DefaultBeanDefinition): boolean {
    return beanDefinition.class.startsWith("/");
  }

  #isRelative(beanDefinition: DefaultBeanDefinition): boolean {
    return beanDefinition.class.startsWith(".");
  }
}
