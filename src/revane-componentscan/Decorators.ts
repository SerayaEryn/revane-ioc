import { createComponentDecorator } from './Component'
import { createScopeDecorator } from './Scope'

const Configuration = createComponentDecorator('configuration')
const Repository = createComponentDecorator('repository')
const Service = createComponentDecorator('service')
const Component = createComponentDecorator('component')
const Controller = createComponentDecorator('controller')
const ControllerAdvice = createComponentDecorator('controlleradvice')
const Scheduler = createComponentDecorator('scheduler')

const Scope = createScopeDecorator()

export {
  Configuration,
  Repository,
  Service,
  Component,
  Controller,
  ControllerAdvice,
  Scheduler,
  Scope
}
