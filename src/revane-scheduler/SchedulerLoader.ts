import { Loader, LoaderOptions, BeanDefinition } from '../revane-ioc/RevaneIOC'
import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition'
import { TaskScheduler } from './TaskScheduler'

export class SchedulerLoader implements Loader {
  private readonly taskScheduler: TaskScheduler

  constructor (taskScheduler: TaskScheduler) {
    this.taskScheduler = taskScheduler
  }

  public async load (options: LoaderOptions, basePackage: string): Promise<BeanDefinition[]> {
    const configuration = new DefaultBeanDefinition('taskScheduler')
    configuration.instance = this.taskScheduler
    configuration.scope = 'singleton'
    return [configuration]
  }

  public type (): string {
    return 'taskScheduler'
  }

  public isRelevant (options: LoaderOptions): boolean {
    return options.file === 'taskScheduler'
  }
}
