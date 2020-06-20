import { Component, ConditionalOnMissingBean } from '../../src/revane-ioc/RevaneIOC'

@Component('conditionalOnMissingBean')
@ConditionalOnMissingBean()
export default class Test {}
