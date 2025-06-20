import { Component, ConditionalOnResource } from '../../src/revane-ioc/RevaneIOC.js'

@Component
@ConditionalOnResource("signal.json")
export class ConditionalOnFile1 {

}