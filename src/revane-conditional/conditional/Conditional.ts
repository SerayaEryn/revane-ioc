import { RevaneConfiguration } from "../../revane-configuration/RevaneConfiguration.js";
import { conditionalSym } from "../Symbols.js";
import { Condition } from "./Condition.js";

export interface ConditionDefinition {
  conditionClass: new (configuration: RevaneConfiguration) => Condition;
  data: any;
}

function Conditional(conditionClass: any, data: any): (target: any) => any {
  return function decorate(target: any) {
    let meta: ConditionDefinition[] = Reflect.getMetadata(
      conditionalSym,
      target,
    );
    if (meta == null) {
      meta = [];
    }
    meta.push({
      conditionClass,
      data,
    });
    Reflect.defineMetadata(conditionalSym, meta, target);
    return target;
  };
}

export { Conditional };
