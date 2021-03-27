import { RevaneConfiguration } from '../revane-configuration/RevaneConfiguration'
import Loader from '../revane-ioc-core/Loader'
import { LoaderOptions } from '../revane-ioc-core/Options'
import { BeanFactoryPostProcessor } from '../revane-ioc-core/postProcessors/BeanFactoryPostProcessor'
import { Extension } from '../revane-ioc/Extension'
import { Options } from './Options'
import { SchedulerBeanPostProcessor } from './SchedulerBeanPostProcessor'
import { SchedulerLoader } from './SchedulerLoader'
import { TaskScheduler } from './TaskScheduler'

export class SchedulingExtension implements Extension {
  private readonly taskScheduler = new TaskScheduler()
  private enabled = false

  constructor (private readonly options: Options | null) {
    if (this.options != null) {
      this.enabled = this.options.enabled
    }
  }

  public async initialize (configuration: RevaneConfiguration): Promise<void> {
    let enabled = false
    if (configuration.has('revane.scheduling.enabled')) {
      enabled = configuration.getBoolean('revane.scheduling.enabled')
    }
    if (this.options == null) {
      this.enabled = enabled
    }
  }

  public beanFactoryPostProcessors (): BeanFactoryPostProcessor[] {
    return [
      new SchedulerBeanPostProcessor(this.taskScheduler, this.enabled)
    ]
  }

  public beanLoaders (): Loader[] {
    return [new SchedulerLoader(this.taskScheduler)]
  }

  public loaderOptions (): LoaderOptions[] {
    return [{ file: 'taskScheduler' }]
  }

  public async close (): Promise<void> {
    return this.taskScheduler.close()
  }
}
