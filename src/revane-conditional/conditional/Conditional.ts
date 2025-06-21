import { RevaneConfiguration } from "../../revane-configuration/RevaneConfiguration.js";
import { conditionalSym } from "../Symbols.js";
import { Condition } from "./Condition.js";

export interface ConditionDefinition {
  conditionClass: new (configuration: RevaneConfiguration) => Condition;
  data: any;
}

function ConditionalNew(
  conditionClass: any,
  data: any,
): (target: any, context: ClassDecoratorContext) => void {
  return function decorate(target: any, context: ClassDecoratorContext) {
    const meta =
      (context.metadata![conditionalSym] as ConditionDefinition[]) ?? [];
    meta.push({
      conditionClass,
      data,
    });
    context.metadata![conditionalSym] = meta;
  };
}

function Conditional(conditionClass: any, data: any): (target: any) => any {
  return function decorate(target: any) {
    const meta: ConditionDefinition[] =
      Reflect.getMetadata(conditionalSym, target) ?? [];
    meta.push({
      conditionClass,
      data,
    });
    Reflect.defineMetadata(conditionalSym, meta, target);
    return target;
  };
}

export { Conditional, ConditionalNew };
