import { getMetadata, setMetadata } from "../../revane-utils/Metadata.js";
import { valueSym } from "../Symbols.js";

export interface ValueOptions {
  key: string;
  type?: "number" | "string" | "boolean" | null;
}

export function Value(options: ValueOptions): ParameterDecorator {
  return function ValueDecorator(
    target: object,
    _: string | symbol,
    parameterIndex: number,
  ) {
    const values: Record<number, ValueOptions> =
      getMetadata(valueSym, target) ?? {};
    values[parameterIndex] = options;
    setMetadata(valueSym, values, target);
  };
}
