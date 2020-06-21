import { Reflect } from '../revane-utils/Reflect'

function createScheduledDecorator (): Function {
  return function decoratoteScheduledFactory (cronPattern: string) {
    return function define (target, propertyKey: string, descriptor: PropertyDescriptor): void {
      Reflect.defineMetadata(
        'scheduled',
        {
          cronPattern,
          propertyKey
        },
        target
      )
    }
  }
}

const Scheduled = createScheduledDecorator()

export {
  Scheduled
}
