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
  target,
  id: string,
  propertyKey: string | ClassMethodDecoratorContext,
): void {
  if (typeof propertyKey == "string") {
    const beans = getMetadata(beansSym, target.constructor) ?? [];
    beans.push({
      id,
      type: "component",
      propertyKey,
    });
    setMetadata(beansSym, beans, target.constructor);
  } else {
    const context = propertyKey as ClassMethodDecoratorContext;
    const beans = (context.metadata![beansSym] as any[]) ?? [];
    beans.push({
      id,
      type: "component",
      propertyKey,
    });
    context.metadata![beansSym] = beans;
  }
}
