'use strict'

import { createComponentDecorator } from './Component'
import { createScopeDecorator } from './Scope'
import { createBeanDecorator } from './Bean'
import { createConditionalOnMissingBeanDecorator } from './ConditionalOnMissingBean'

const Configuration = createComponentDecorator('configuration')
const Repository = createComponentDecorator('repository')
const Service = createComponentDecorator('service')
const Component = createComponentDecorator('component')
const Controller = createComponentDecorator('controller')
const ControllerAdvice = createComponentDecorator('controlleradvice')
const Scheduler = createComponentDecorator('scheduler')
const Scope = createScopeDecorator()
const Bean = createBeanDecorator()
const ConditionalOnMissingBean = createConditionalOnMissingBeanDecorator()

export {
  Configuration,
  Repository,
  Service,
  Component,
  Controller,
  ControllerAdvice,
  Scheduler,
  Scope,
  Bean,
  ConditionalOnMissingBean
}
