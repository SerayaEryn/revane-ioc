import { getMetadata, setMetadata } from "../revane-utils/Metadata.js";
import { beansSym } from "./Symbols.js";

export interface BeanOptions {
  id?: string;
  aliasIds?: string[];
}

export function Bean(
  maybeId?: string | BeanOptions | null | undefined | any,
  maybePropertyKey?: string | undefined | ClassMethodDecoratorContext,
  _?: PropertyDescriptor,
) {
  if (
    typeof maybeId === "string" ||
    (typeof maybeId === "object" &&
      (maybeId["id"] != null || maybeId["aliasIds"] != null)) ||
    maybeId == null
  ) {
    return function define(
      target: any,
      propertyKey: string | ClassMethodDecoratorContext,
    ): void | any {
      const id =
        (maybeId ?? typeof propertyKey == "string")
          ? (propertyKey as string)
          : ((propertyKey as ClassMethodDecoratorContext).name as string);

      if (
        maybeId != null &&
        (maybeId["id"] != null || maybeId["aliasIds"] != null)
      ) {
        addBean(
          target,
          {
            id: maybeId["id"] ?? id,
            aliasIds: maybeId["aliasIds"] ?? [],
          },
          propertyKey,
        );
      } else {
        addBean(target, id, propertyKey);
      }
      return typeof propertyKey == "string" ? undefined : target;
    };
  } else {
    addBean(maybeId, maybePropertyKey as string, maybePropertyKey as string);
    return typeof maybePropertyKey == "string" ? undefined : maybeId;
  }
}

function addBean(
  target: any,
  id: string | BeanOptions,
  propertyKey: string | ClassMethodDecoratorContext,
): void {
  const context =
    typeof propertyKey !== "object" ? target.constructor : (propertyKey as any);
  const beans = getMetadata(beansSym, context) ?? [];
  beans.push({
    id: typeof id === "object" ? (id as BeanOptions).id : id,
    aliasIds:
      typeof id === "object" ? ((id as BeanOptions).aliasIds ?? []) : [],
    type: "component",
    propertyKey,
  });
  setMetadata(beansSym, beans, target.constructor, context);
}
