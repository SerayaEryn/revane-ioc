// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function createScheduledDecorator(): Function {
  return function decoratoteScheduledFactory(cronPattern: string) {
    return function define(
      target,
      propertyKey: string | ClassMethodDecoratorContext,
      _: PropertyDescriptor,
    ): void {
      if (typeof propertyKey == "string") {
        Reflect.defineMetadata(
          "scheduled",
          {
            cronPattern,
            propertyKey,
          },
          target,
        );
      } else {
        const context = propertyKey as ClassMethodDecoratorContext;
        context.metadata!["scheduled"] = {
          cronPattern,
          propertyKey: context.name,
        };
        return target;
      }
    };
  };
}

const Scheduled = createScheduledDecorator();

export { Scheduled };
