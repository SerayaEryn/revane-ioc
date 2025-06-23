import { setMetadata } from "../revane-utils/Metadata.js";
import { postConstructSym, preDestroySym } from "./Symbols.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function createLifeCycleDecorator(symbol: symbol): Function {
  return function decorateLifeCycleFunction(
    target: any,
    propertyKey: string | ClassMethodDecoratorContext,
    _: PropertyDescriptor,
  ) {
    setMetadata(
      symbol,
      { propertyKey },
      target,
      propertyKey as ClassMethodDecoratorContext,
    );
  };
}

const PostConstruct = createLifeCycleDecorator(postConstructSym);
const PreDestroy = createLifeCycleDecorator(preDestroySym);

export { PostConstruct, PreDestroy };
