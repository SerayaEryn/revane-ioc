import { Reflect } from '../../revane-utils/Reflect'

export function createLifeCycleDecorator (type: string): Function {
  return function decorateLifeCycleFunction (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(`life-cycle:${type}`, { propertyKey }, target)
  }
}
