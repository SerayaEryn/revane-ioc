import { Conditional } from "../RevaneConditional.js";
import { PropertyCondition } from "./PropertyCondition.js";

function ConditionalOnProperty(
  property: string,
  value: boolean | string | number,
  fallback?: boolean | string | number,
) {
  return Conditional(PropertyCondition, { property, value, fallback });
}

export { ConditionalOnProperty };
