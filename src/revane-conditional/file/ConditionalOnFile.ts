import { conditionalOnFileSym } from "../Symbols.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function createConditionalOnFileDecorator(): Function {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return function decorateWithOptions(path: string): Function {
    return function decorate(target: any) {
      Reflect.defineMetadata(conditionalOnFileSym, path, target);
      return target;
    };
  };
}

const ConditionalOnFile = createConditionalOnFileDecorator();

export { ConditionalOnFile };
