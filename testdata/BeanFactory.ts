import { Bean } from '../src/revane-ioc/RevaneIOC'

export default class BeanFactory {
  @Bean
  testBean () {
    return { test: '42' }
  }

  @Bean()
  testBean2 () {
    return { test: '43' }
  }
}
