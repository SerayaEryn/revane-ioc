import { Conditional } from "../RevaneConditional.js";
import { ResourceCondition } from "./ResourceCondition.js";

function ConditionalOnResource(file: string) {
  return Conditional(ResourceCondition, { file });
}

export { ConditionalOnResource };
