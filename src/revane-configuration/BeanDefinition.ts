import { BeanDefinition } from '../revane-ioc-core/BeanDefinition'

declare module '../revane-ioc-core/BeanDefinition' {
  interface BeanDefinition {
    configurationProperties?: any
  }
}
