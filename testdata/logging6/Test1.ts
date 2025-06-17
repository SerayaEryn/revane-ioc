import { Component, Logger } from '../../src/revane-ioc/RevaneIOC.js'

@Component
export class Test1 {
  constructor (private readonly logger: Logger) {}
}
