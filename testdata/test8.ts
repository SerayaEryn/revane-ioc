import { Service } from '../src/revane-ioc/RevaneIOC'

@Service
export default class Test8 {
  test6: any
  invoked: boolean
  constructor (test6) {
    this.test6 = test6
  }

  doSomething (): void {
    this.invoked = true
  }
}
