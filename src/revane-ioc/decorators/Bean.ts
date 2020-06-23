import { Reflect } from '../../revane-utils/Reflect'
import { beansSym } from './Symbols'

export function createBeanDecorator (): Function {
  return function decoratoteBeanFactory (maybeId, maybePropertyKey: string, descriptor: PropertyDescriptor) {
    if (typeof maybeId === 'string' || maybeId === undefined) {
      return function define (target, propertyKey: string, descriptor: PropertyDescriptor): void {
        addBean(target, maybeId || propertyKey, propertyKey)
      }
    } else {
      addBean(maybeId, maybePropertyKey, maybePropertyKey)
    }
  }
}

function addBean (target, id: string, propertyKey: string): void {
  const beans = Reflect.getMetadata(beansSym, target) || []
  beans.push({
    id,
    type: 'component',
    propertyKey
  })
  Reflect.defineMetadata(beansSym, beans, target)
}
