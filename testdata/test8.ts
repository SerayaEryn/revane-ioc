import { Service } from '../src/revane-ioc/RevaneIOC.js'

@Service
export default class Test8 {
  test6: any
  invoked = false
  constructor (test6) {
    this.test6 = test6
  }

  doSomething (): void {
    this.invoked = true
  }
}
