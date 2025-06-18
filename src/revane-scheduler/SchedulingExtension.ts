import { RevaneConfiguration } from "../revane-configuration/RevaneConfiguration.js";
import Loader from "../revane-ioc-core/Loader.js";
import { BeanFactoryPostProcessor } from "../revane-ioc-core/postProcessors/BeanFactoryPostProcessor.js";
import { Extension } from "../revane-ioc/Extension.js";
import { Options } from "./Options.js";
import { SchedulerBeanPostProcessor } from "./SchedulerBeanPostProcessor.js";
import { SchedulerLoader } from "./SchedulerLoader.js";
import { TaskScheduler } from "./TaskScheduler.js";

export class SchedulingExtension extends Extension {
  readonly #taskScheduler = new TaskScheduler();
  #enabled = false;

  constructor(private readonly options: Options | null) {
    super();
    if (this.options != null) {
      this.#enabled = this.options.enabled;
    }
  }

  public async initialize(configuration: RevaneConfiguration): Promise<void> {
    let enabled = false;
    if (configuration.has("revane.scheduling.enabled")) {
      enabled = configuration.getBoolean("revane.scheduling.enabled");
    }
    if (this.options == null) {
      this.#enabled = enabled;
    }
  }

  public beanFactoryPostProcessors(): BeanFactoryPostProcessor[] {
    return [new SchedulerBeanPostProcessor(this.#taskScheduler, this.#enabled)];
  }

  public beanLoaders(): Loader[] {
    return [new SchedulerLoader(this.#taskScheduler)];
  }

  public async close(): Promise<void> {
    return this.#taskScheduler.close();
  }
}
