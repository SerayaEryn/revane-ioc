import { PreDestroy } from '../../src/revane-ioc/RevaneIOC.js'

export default class Xml2 {
  xml1: any
  destroyed = false

  constructor (xml1) {
    this.xml1 = xml1
  }

  @PreDestroy
  preDestroy (): void {
    this.destroyed = true
  }
}
