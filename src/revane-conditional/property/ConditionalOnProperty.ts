import { conditionalOnPropertySym } from "../Symbols.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function createConditionalOnPropertyDecorator(): Function {
  return function decorateWithOptions(
    property: string,
    value: boolean | string | number,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  ): Function {
    return function decorate(target: any) {
      Reflect.defineMetadata(
        conditionalOnPropertySym,
        { property, value },
        target,
      );
      return target;
    };
  };
}

const ConditionalOnProperty = createConditionalOnPropertyDecorator();

export { ConditionalOnProperty };
