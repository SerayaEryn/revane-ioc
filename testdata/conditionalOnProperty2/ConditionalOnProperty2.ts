import { Component, ConditionalOnProperty } from '../../src/revane-ioc/RevaneIOC.js'

@Component
@ConditionalOnProperty("test.property", "hallo")
export class ConditionalOnProperty2 {

}