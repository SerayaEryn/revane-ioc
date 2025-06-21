import { ConditionalNew } from "../conditional/Conditional.js";
import { Conditional } from "../RevaneConditional.js";
import { PropertyCondition } from "./PropertyCondition.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ConditionalOnPropertyNew(
  property: string,
  value: boolean | string | number,
) {
  return ConditionalNew(PropertyCondition, { property, value });
}

function ConditionalOnProperty(
  property: string,
  value: boolean | string | number,
) {
  return Conditional(PropertyCondition, { property, value });
}

export { ConditionalOnProperty };
