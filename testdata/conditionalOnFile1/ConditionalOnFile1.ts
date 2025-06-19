import { Component, ConditionalOnFile } from '../../src/revane-ioc/RevaneIOC.js'

@Component
@ConditionalOnFile("signal.json")
export class ConditionalOnFile1 {

}