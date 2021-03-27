import { Service } from '../src/revane-ioc/RevaneIOC'

@Service
export default class Test7 {
  test6: any
  constructor (test6) {
    this.test6 = test6
  }
}
