'use strict'

import { createComponentDecorator } from './Component'
import { createScopeDecorator } from './Scope'
import { createInjectDecorator } from './Inject'
import { createBeanDecorator } from './Bean'
import { createConfigurationPropertiesDecorator } from './ConfigurationProperties'

const Configuration = createComponentDecorator('configuration')
const Repository = createComponentDecorator('repository')
const Service = createComponentDecorator('service')
const Component = createComponentDecorator('component')
const Controller = createComponentDecorator('controller')
const Scope = createScopeDecorator()
const Inject = createInjectDecorator()
const Bean = createBeanDecorator()
const ConfigurationProperties = createConfigurationPropertiesDecorator()

export {
  Configuration,
  Repository,
  Service,
  Component,
  Controller,
  Scope,
  Inject,
  Bean,
  ConfigurationProperties
}
