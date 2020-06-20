import { Component, ConfigurationProperties } from '../../src/revane-ioc/RevaneIOC'

@ConfigurationProperties({ prefix: 'test' })
@Component({ dependencies: ['test6'], id: 'scan3' })
export default class Scan3 {
  arg: any

  constructor (arg) {
    this.arg = arg
  }
}
