// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function createLifeCycleDecorator(type: string): Function {
  return function decorateLifeCycleFunction(
    target: any,
    propertyKey: string,
    _: PropertyDescriptor,
  ) {
    Reflect.defineMetadata(`life-cycle:${type}`, { propertyKey }, target);
  };
}
