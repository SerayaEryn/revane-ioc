import { PostConstruct } from '../../src/revane-ioc/RevaneIOC.js'

export default class Test1 {
  postConstructed = false

  @PostConstruct
  postConstruct (): void {
    this.postConstructed = true
  }
}
