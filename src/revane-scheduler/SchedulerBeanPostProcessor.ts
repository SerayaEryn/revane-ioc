import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import Bean from '../revane-ioc-core/context/bean/Bean'
import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'
import { SchedulingService } from './SchedulingService'
import { NoCronPatternProvided } from './NoCronPatternProvided'
import { InvalidCronPatternProvided } from './InvalidCronPatternProvided'

export class SchedulerBeanPostProcessor implements BeanFactoryPostProcessor {
  private schedulingService: SchedulingService
  private enabled: boolean

  constructor (schedulingService: SchedulingService, enabled: boolean) {
    this.schedulingService = schedulingService
    this.enabled = enabled
  }

  public async postProcess (beanDefinition: BeanDefinition, bean: Bean): Promise<Bean[]> {
    if (this.enabled && beanDefinition.classConstructor.prototype) {
      const scheduled = Reflect.getMetadata('scheduled', beanDefinition.classConstructor.prototype)
      if (scheduled) {
        if (!scheduled.cronPattern) {
          throw new NoCronPatternProvided()
        }
        if (typeof scheduled.cronPattern !== 'string') {
          throw new InvalidCronPatternProvided(scheduled.cronPattern)
        }
        const instance = await bean.getInstance()
        const functionToSchedule = instance[scheduled.propertyKey].bind(instance)
        this.schedulingService.schedule(scheduled.cronPattern, functionToSchedule)
      }
    }
    return [ bean ]
  }
}