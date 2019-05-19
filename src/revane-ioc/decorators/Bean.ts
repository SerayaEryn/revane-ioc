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

function addBean (target, id: string, propertyKey: string) {
  const beans = Reflect.getMetadata('beans', target) || []
  beans.push({
    id,
    type: 'component',
    instance: target[propertyKey]()
  })
  Reflect.defineMetadata('beans', beans, target)
}
