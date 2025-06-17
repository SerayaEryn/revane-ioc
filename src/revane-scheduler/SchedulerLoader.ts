import { Loader, LoaderOptions, BeanDefinition } from '../revane-ioc/RevaneIOC.js'
import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition.js'
import { TaskScheduler } from './TaskScheduler.js'

export class SchedulerLoader implements Loader {
  #taskScheduler: TaskScheduler

  constructor (taskScheduler: TaskScheduler) {
    this.#taskScheduler = taskScheduler
  }

  public async load (_: LoaderOptions[]): Promise<BeanDefinition[]> {
    const configuration = new DefaultBeanDefinition('taskScheduler')
    configuration.instance = this.#taskScheduler
    configuration.scope = 'singleton'
    return [configuration]
  }

  public type (): string {
    return 'taskScheduler'
  }
}
