import { RevaneConfiguration } from "../../revane-configuration/RevaneConfiguration.js";
import { getMetadata, setMetadata } from "../../revane-utils/Metadata.js";
import { conditionalSym } from "../Symbols.js";
import { Condition } from "./Condition.js";

export interface ConditionDefinition {
  conditionClass: new (configuration: RevaneConfiguration) => Condition;
  data: any;
}

function Conditional(conditionClass: any, data: any): (target: any) => any {
  return function decorate(target: any, context?: ClassDecoratorContext) {
    const meta: ConditionDefinition[] =
      getMetadata(conditionalSym, target) ?? [];
    meta.push({
      conditionClass,
      data,
    });
    setMetadata(conditionalSym, meta, target, context);
    return context == null ? target : undefined;
  };
}

export { Conditional };
