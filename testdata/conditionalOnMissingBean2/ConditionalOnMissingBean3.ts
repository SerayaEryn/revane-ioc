import { Component, ConditionalOnMissingBean } from '../../src/revane-ioc/RevaneIOC.js'

@Component('conditionalOnMissingBean')
@ConditionalOnMissingBean()
export default class ConditionalOnMissingBean3 {}
