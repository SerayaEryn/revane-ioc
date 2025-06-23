import { getMetadata, setMetadata } from "../revane-utils/Metadata.js";
import { beansSym } from "./Symbols.js";

export function Bean(
  maybeId?: string | null | undefined | any,
  maybePropertyKey?: string | undefined | ClassMethodDecoratorContext,
  _?: PropertyDescriptor,
) {
  if (typeof maybeId === "string" || maybeId == null) {
    return function define(
      target: any,
      propertyKey: string | ClassMethodDecoratorContext,
    ): void | any {
      addBean(
        target,
        (maybeId ?? typeof propertyKey == "string")
          ? (propertyKey as string)
          : ((propertyKey as ClassMethodDecoratorContext).name as string),
        propertyKey,
      );
      return typeof propertyKey == "string" ? undefined : target;
    };
  } else {
    addBean(maybeId, maybePropertyKey as string, maybePropertyKey as string);
    return typeof maybePropertyKey == "string" ? undefined : maybeId;
  }
}

function addBean(
  target: any,
  id: string,
  propertyKey: string | ClassMethodDecoratorContext,
): void {
  const context =
    typeof propertyKey !== "object" ? target.constructor : (propertyKey as any);
  const beans = getMetadata(beansSym, context) ?? [];
  beans.push({
    id,
    type: "component",
    propertyKey,
  });
  setMetadata(beansSym, beans, target.constructor, context);
}
