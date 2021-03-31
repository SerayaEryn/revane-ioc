import { Bean, PostConstruct, PreDestroy } from '../src/revane-ioc/RevaneIOC'

export default class BeanFactory {
  @Bean
  testBean (): any {
    return new Test()
  }

  @Bean()
  testBean2 (): any {
    return { test: '43' }
  }
}

class Test {
  test = '42'
  post = false
  pre = false

  @PostConstruct
  postConstruct () {
    this.post = true
  }

  @PreDestroy
  preDestroy () {
    this.pre = true
  }
}
