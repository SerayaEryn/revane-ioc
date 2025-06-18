import { beansSym } from "./Symbols.js";
import "reflect-metadata";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function createBeanDecorator(): Function {
  return function Bean(
    maybeId,
    maybePropertyKey: string,
    _: PropertyDescriptor,
  ) {
    if (typeof maybeId === "string" || maybeId == null) {
      return function define(
        target,
        propertyKey: string,
        _: PropertyDescriptor,
      ): void {
        addBean(target, maybeId ?? propertyKey, propertyKey);
      };
    } else {
      addBean(maybeId, maybePropertyKey, maybePropertyKey);
    }
  };
}

function addBean(target, id: string, propertyKey: string): void {
  const beans = Reflect.getMetadata(beansSym, target) ?? [];
  beans.push({
    id,
    type: "component",
    propertyKey,
  });
  Reflect.defineMetadata(beansSym, beans, target);
}

const Bean = createBeanDecorator();

export { Bean };
