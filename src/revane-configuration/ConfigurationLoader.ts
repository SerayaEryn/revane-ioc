import { Loader, LoaderOptions, BeanDefinition } from '../revane-ioc/RevaneIOC'
import DefaultBeanDefinition from '../revane-ioc-core/DefaultBeanDefinition'
import { RevaneConfiguration } from './RevaneConfiguration'

export class ConfigurationLoader implements Loader {
  constructor (private readonly configuration: RevaneConfiguration) {
    this.configuration = configuration
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async load (options: LoaderOptions[]): Promise<BeanDefinition[]> {
    const configuration = new DefaultBeanDefinition('configuration')
    configuration.instance = this.configuration
    configuration.scope = 'singleton'
    return [configuration]
  }

  public type (): string {
    return 'configuration'
  }
}
