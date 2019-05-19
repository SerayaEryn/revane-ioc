'use strict'

import { createComponentDecorator } from './Component'
import { createScopeDecorator } from './Scope'
import { createInjectDecorator } from './Inject'
import { createBeanDecorator } from './Bean'

const Repository = createComponentDecorator('repository')
const Service = createComponentDecorator('service')
const Component = createComponentDecorator('component')
const Controller = createComponentDecorator('controller')
const Scope = createScopeDecorator()
const Inject = createInjectDecorator()
const Bean = createBeanDecorator()

export {
  Repository,
  Service,
  Component,
  Controller,
  Scope,
  Inject,
  Bean
}
