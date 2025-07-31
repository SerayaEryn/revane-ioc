import { Component, ConditionalOnProperty } from '../../src/revane-ioc/RevaneIOC.js'

@Component
@ConditionalOnProperty("test.property", "hallo", "hallo")
export class ConditionalOnProperty3 {

}