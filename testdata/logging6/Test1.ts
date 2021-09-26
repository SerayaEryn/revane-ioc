import { Component, Logger } from '../../src/revane-ioc/RevaneIOC'

@Component
export class Test1 {
  constructor (private readonly logger: Logger) {}
}
