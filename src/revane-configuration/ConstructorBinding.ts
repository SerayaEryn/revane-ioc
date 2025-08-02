import { setMetadata } from "../revane-utils/Metadata.js";
import { constructorBindingSym } from "./Symbols.js";
import {
  constructorParameterNames,
  getSyntaxTree,
} from "../revane-utils/AcornUtil.js";
import { Constructor } from "../revane-ioc-core/Constructor.js";

export function ConstructorBinding(
  target: Constructor,
  context?: ClassDecoratorContext,
) {
  setMetadata(
    constructorBindingSym,
    {
      constructorParameterNames: constructorParameterNames(
        getSyntaxTree(target),
      ),
    },
    target,
    context,
  );
}
