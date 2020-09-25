import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import Bean from '../revane-ioc-core/context/bean/Bean'
import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'
import { TaskScheduler } from './TaskScheduler'
import { NoCronPatternProvided } from './NoCronPatternProvided'
import { InvalidCronPatternProvided } from './InvalidCronPatternProvided'
import { Reflect } from '../revane-utils/Reflect'

export class SchedulerBeanPostProcessor implements BeanFactoryPostProcessor {
  private readonly schedulingService: TaskScheduler
  private readonly enabled: boolean

  constructor (schedulingService: TaskScheduler, enabled: boolean) {
    this.schedulingService = schedulingService
    this.enabled = enabled
  }

  public async postProcess (beanDefinition: BeanDefinition, bean: Bean): Promise<Bean[]> {
    const { classConstructor } = beanDefinition
    if (this.enabled && classConstructor != null && classConstructor.prototype != null) {
      const scheduled = Reflect.getMetadata('scheduled', classConstructor.prototype)
      if (scheduled != null) {
        if (scheduled.cronPattern == null) {
          throw new NoCronPatternProvided()
        }
        if (typeof scheduled.cronPattern !== 'string') {
          throw new InvalidCronPatternProvided(scheduled.cronPattern)
        }
        const instance = await bean.getInstance()
        const { propertyKey, cronPattern } = scheduled
        const isAsyncFunction = this.isAsyncFunction(instance[propertyKey])
        const functionToSchedule = instance[propertyKey].bind(instance)
        this.schedulingService.schedule(cronPattern, functionToSchedule, isAsyncFunction)
      }
    }
    return [bean]
  }

  private isAsyncFunction (f: Function): boolean {
    return f.constructor.name === 'AsyncFunction'
  }
}
