import { Conditional } from "../RevaneConditional.js";
import { PropertyCondition } from "./PropertyCondition.js";

function ConditionalOnProperty(
  property: string,
  value: boolean | string | number,
  matchIfMissing?: boolean,
) {
  return Conditional(PropertyCondition, { property, value, matchIfMissing });
}

export { ConditionalOnProperty };
