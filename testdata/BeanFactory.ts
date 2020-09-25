import { Bean } from '../src/revane-ioc/RevaneIOC'

export default class BeanFactory {
  @Bean
  testBean (): any {
    return { test: '42' }
  }

  @Bean()
  testBean2 (): any {
    return { test: '43' }
  }
}
