import { Component, ConditionalOnProperty } from '../../src/revane-ioc/RevaneIOC.js'

@Component
@ConditionalOnProperty("test.property", "hallo", true)
export class ConditionalOnProperty3 {

}