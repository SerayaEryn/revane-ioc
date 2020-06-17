'use strict'

import { createComponentDecorator } from './Component'
import { createScopeDecorator } from './Scope'
import { createBeanDecorator } from './Bean'

const Configuration = createComponentDecorator('configuration')
const Repository = createComponentDecorator('repository')
const Service = createComponentDecorator('service')
const Component = createComponentDecorator('component')
const Controller = createComponentDecorator('controller')
const Scheduler = createComponentDecorator('scheduler')
const Scope = createScopeDecorator()
const Bean = createBeanDecorator()

export {
  Configuration,
  Repository,
  Service,
  Component,
  Controller,
  Scheduler,
  Scope,
  Bean
}
