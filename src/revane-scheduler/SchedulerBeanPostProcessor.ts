import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import Bean from '../revane-ioc-core/context/bean/Bean'
import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'
import { TaskScheduler } from './TaskScheduler'
import { NoCronPatternProvided } from './NoCronPatternProvided'
import { InvalidCronPatternProvided } from './InvalidCronPatternProvided'

export class SchedulerBeanPostProcessor implements BeanFactoryPostProcessor {
  private readonly schedulingService: TaskScheduler
  private readonly enabled: boolean

  constructor (schedulingService: TaskScheduler, enabled: boolean) {
    this.schedulingService = schedulingService
    this.enabled = enabled
  }

  public async postProcess (beanDefinition: BeanDefinition, bean: Bean): Promise<Bean[]> {
    if (this.enabled && beanDefinition.classConstructor.prototype != null) {
      const scheduled = Reflect.getMetadata('scheduled', beanDefinition.classConstructor.prototype)
      if (scheduled != null) {
        if (scheduled.cronPattern == null) {
          throw new NoCronPatternProvided()
        }
        if (typeof scheduled.cronPattern !== 'string') {
          throw new InvalidCronPatternProvided(scheduled.cronPattern)
        }
        const instance = await bean.getInstance()
        const asyncFunction = instance[scheduled.propertyKey].constructor.name === 'AsyncFunction'
        const functionToSchedule = instance[scheduled.propertyKey].bind(instance)
        this.schedulingService.schedule(scheduled.cronPattern, functionToSchedule, asyncFunction)
      }
    }
    return [bean]
  }
}
