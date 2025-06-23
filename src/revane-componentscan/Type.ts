import { Constructor } from "../revane-ioc-core/Constructor.js";
import { getMetadata, setMetadata } from "../revane-utils/Metadata.js";
import { dependencyTypesSym } from "./Symbols.js";

export function Type(type: Constructor): ParameterDecorator {
  return function Type(
    target: object,
    _: string | symbol,
    parameterIndex: number,
  ) {
    const dependencyTypes = getMetadata(dependencyTypesSym, target) ?? {};
    dependencyTypes[parameterIndex] = type;
    setMetadata(dependencyTypesSym, dependencyTypes, target);
  };
}
