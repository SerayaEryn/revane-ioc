import Loader from "../revane-ioc-core/Loader.js";
import { BeanFactoryPostProcessor } from "../revane-ioc-core/postProcessors/BeanFactoryPostProcessor.js";
import { BeanFactoryPreProcessor } from "../revane-ioc-core/preProcessors/BeanFactoryPreProcessor.js";
import { Extension } from "../revane-ioc/Extension.js";
import Options from "../revane-ioc/Options.js";
import { buildConfiguration } from "./ConfigurationFactory.js";
import { ConfigurationLoader } from "./ConfigurationLoader.js";
import { ConfigurationPropertiesPostProcessor } from "./ConfigurationPropertiesPostProcessor.js";
import { ConfigurationPropertiesPreProcessor } from "./ConfigurationPropertiesPreProcessor.js";
import { RevaneConfiguration } from "./RevaneConfiguration.js";

export class ConfigurationExtension extends Extension {
  #configuration: RevaneConfiguration
  #enabled: boolean

  constructor(options: Options, profile: string | null) {
    super()
    this.#configuration = buildConfiguration(options, profile)
    this.#enabled = !(options.configuration?.disabled ?? false)
  }

  public async initialize (configuration: RevaneConfiguration): Promise<void> {
    await this.#configuration.init()
  }
  
  public beanFactoryPreProcessors (): BeanFactoryPreProcessor[] {
    if (this.#enabled) {
      return [new ConfigurationPropertiesPreProcessor()]
    }
    return []
  }

  public beanFactoryPostProcessors (): BeanFactoryPostProcessor[] {
    if (this.#enabled) {
      return [new ConfigurationPropertiesPostProcessor(this.#configuration)]
    }
    return []
  }

  public beanLoaders (): Loader[] {
    if (this.#enabled) {
      return [new ConfigurationLoader(this.#configuration)]
    }
    return []
  }

  public get(): RevaneConfiguration {
    return this.#configuration
  }
}