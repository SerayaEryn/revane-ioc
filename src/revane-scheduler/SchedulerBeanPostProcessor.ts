import { BeanFactoryPostProcessor } from "../revane-ioc-core/postProcessors/BeanFactoryPostProcessor.js";
import Bean from "../revane-ioc-core/context/bean/Bean.js";
import { BeanDefinition } from "../revane-ioc-core/BeanDefinition.js";
import { TaskScheduler } from "./TaskScheduler.js";
import { NoCronPatternProvided } from "./NoCronPatternProvided.js";
import { InvalidCronPatternProvided } from "./InvalidCronPatternProvided.js";
import { isAsyncFunction } from "node:util/types";

export class SchedulerBeanPostProcessor implements BeanFactoryPostProcessor {
  readonly #schedulingService: TaskScheduler;
  readonly #enabled: boolean;

  constructor(schedulingService: TaskScheduler, enabled: boolean) {
    this.#schedulingService = schedulingService;
    this.#enabled = enabled;
  }

  public async postProcess(
    beanDefinition: BeanDefinition,
    bean: Bean,
    instance: any,
  ): Promise<void> {
    if (!this.#enabled) {
      return;
    }
    const scheduled = Reflect.getMetadata(
      "scheduled",
      instance.constructor.prototype,
    );
    if (scheduled == null) {
      return;
    }
    if (scheduled.cronPattern == null) {
      throw new NoCronPatternProvided();
    }
    if (typeof scheduled.cronPattern !== "string") {
      throw new InvalidCronPatternProvided(scheduled.cronPattern);
    }
    const { propertyKey, cronPattern } = scheduled;
    const functionToSchedule = instance[propertyKey].bind(instance);
    this.#schedulingService.schedule(
      cronPattern,
      functionToSchedule,
      isAsyncFunction(instance[propertyKey]),
    );
  }
}
