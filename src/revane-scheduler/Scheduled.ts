// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function createScheduledDecorator(): Function {
  return function decoratoteScheduledFactory(cronPattern: string) {
    return function define(
      target,
      propertyKey: string,
      _: PropertyDescriptor,
    ): void {
      Reflect.defineMetadata(
        "scheduled",
        {
          cronPattern,
          propertyKey,
        },
        target,
      );
    };
  };
}

const Scheduled = createScheduledDecorator();

export { Scheduled };
