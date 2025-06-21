import { ConditionalNew } from "../conditional/Conditional.js";
import { Conditional } from "../RevaneConditional.js";
import { ResourceCondition } from "./ResourceCondition.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ConditionalOnResourceNew(file: string) {
  return ConditionalNew(ResourceCondition, { file });
}

function ConditionalOnResource(file: string) {
  return Conditional(ResourceCondition, { file });
}

export { ConditionalOnResource };
