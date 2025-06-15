import { Loader, LoaderOptions, BeanDefinition } from '../revane-ioc/RevaneIOC'
import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition'
import { TaskScheduler } from './TaskScheduler'

export class SchedulerLoader implements Loader {
  constructor (private readonly taskScheduler: TaskScheduler) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async load (options: LoaderOptions[]): Promise<BeanDefinition[]> {
    const configuration = new DefaultBeanDefinition('taskScheduler')
    configuration.instance = this.taskScheduler
    configuration.scope = 'singleton'
    return [configuration]
  }

  public type (): string {
    return 'taskScheduler'
  }
}
