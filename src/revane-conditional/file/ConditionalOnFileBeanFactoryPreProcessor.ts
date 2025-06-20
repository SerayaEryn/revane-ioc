import { join } from "node:path";
import { BeanDefinition } from "../../revane-ioc-core/BeanDefinition.js";
import { BeanFactoryPreProcessor } from "../../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js";
import { conditionalOnFileSym } from "../Symbols.js";
import { access, constants } from "node:fs/promises";
import { RevaneConfiguration } from "../../revane-ioc/RevaneIOC.js";

export class ConditionalOnFileBeanFactoryPreProcessor
  implements BeanFactoryPreProcessor
{
  #basePackage: string;

  constructor(configuration: RevaneConfiguration) {
    this.#basePackage = configuration.getString("revane.basePackage");
  }

  async preProcess(
    beanDefinition: BeanDefinition,
    _: BeanDefinition[],
  ): Promise<BeanDefinition[]> {
    const classConstructor = beanDefinition.classConstructor;
    if (classConstructor == null) return [beanDefinition];
    const conditionalOnFile: string = Reflect.getMetadata(
      conditionalOnFileSym,
      classConstructor,
    );
    if (conditionalOnFile == null) {
      return [beanDefinition];
    }
    if (await this.#fileExists(conditionalOnFile)) {
      return [beanDefinition];
    } else {
      return [];
    }
  }

  async #fileExists(path: string): Promise<boolean> {
    const file = join(this.#basePackage, path);
    try {
      await access(file, constants.R_OK);
      return true;
    } catch (_) {
      return false;
    }
  }
}
