import { Bean, Component, PostConstruct, PreDestroy } from '../../src/revane-ioc/RevaneIOC.js'

@Component
export default class BeanFactory {
  @Bean
  testBean (): any {
    return new Test()
  }
}

export class Test {
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
