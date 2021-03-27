import { PostConstruct } from '../src/revane-ioc/RevaneIOC'

export default class Test1 {
  postConstructed: boolean = false

  @PostConstruct
  postConstruct (): void {
    this.postConstructed = true
  }
}
