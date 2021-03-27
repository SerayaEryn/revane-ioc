import { ConfigurationPropertiesData } from './ConfigurationProperties'

declare module '../revane-ioc-core/BeanDefinition' {
  interface BeanDefinition {
    configurationProperties?: ConfigurationPropertiesData
  }
}
