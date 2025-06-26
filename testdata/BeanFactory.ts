import { Bean, PostConstruct, PreDestroy } from '../src/revane-ioc/RevaneIOC.js'

export default class BeanFactory {
  @Bean
  testBean (): any {
    return new Test()
  }

  @Bean()
  testBean2 (): any {
    return { test: '43' }
  }

  @Bean({id: 'hallo0'})
  testBean3 (): any {
    return { test: '43' }
  }

  @Bean({aliasIds: ['hallo1']})
  testBean4 (): any {
    return { test: '43' }
  }

  @Bean({id: 'blubb', aliasIds: ['hallo2']})
  testBean5 (): any {
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
