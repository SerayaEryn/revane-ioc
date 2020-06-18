import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'
import { ConfigurationPropertiesData } from './ConfigurationProperties'

declare module '../revane-ioc-core/BeanDefinition' {
  interface BeanDefinition {
    configurationProperties?: ConfigurationPropertiesData
  }
}
