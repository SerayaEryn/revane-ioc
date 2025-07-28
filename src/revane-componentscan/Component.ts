import Options from "./Options.js";
import { dependenciesSym, idSym, typeSym } from "./Symbols.js";
import { Constructor } from "../revane-ioc-core/Constructor.js";
import { setMetadata } from "../revane-utils/Metadata.js";
import {
  constructorParameterNames,
  getSyntaxTree,
} from "../revane-utils/AcornUtil.js";

export function createComponentDecorator(type: string) {
  return function Component(
    options?: Options | string | any,
    context1?: ClassDecoratorContext,
  ) {
    if (
      typeof options === "string" ||
      options === undefined ||
      options.id ||
      options.dependencies
    ) {
      return function define(
        target: Constructor,
        context2?: ClassDecoratorContext,
      ) {
        return decoratorWithParameters(target, options, type, context2);
      };
    } else {
      return decoratorNoParameters(options, type, context1);
    }
  };
}

function decoratorNoParameters(
  target: any,
  type: string,
  context?: ClassDecoratorContext,
) {
  const tree = getSyntaxTree(target);
  const opts = new Options();
  setMetadata(dependenciesSym, getDependencies(tree, opts), target, context);
  setMetadata(idSym, getId(tree), target, context);
  setMetadata(typeSym, type, target, context);
  return context == null ? target : undefined;
}

function decoratorWithParameters(
  target: any,
  options: any,
  type: string,
  context?: ClassDecoratorContext,
) {
  let opts: Options;
  let id: string | null;
  if (typeof options === "string") {
    id = options;
    opts = new Options();
  } else {
    opts = (options as Options) ?? new Options();
    id = opts.id === undefined ? null : opts.id;
  }

  const tree = getSyntaxTree(target);
  setMetadata(dependenciesSym, getDependencies(tree, opts), target, context);
  setMetadata(idSym, id ?? getId(tree), target, context);
  setMetadata(typeSym, type, target, context);
  return context == null ? target : undefined;
}

function getId(tree): string {
  const className: string = tree.body[0].id.name;
  return className.substring(0, 1).toLowerCase() + className.substring(1);
}

function getDependencies(tree, options: Options): string[] {
  if (options.dependencies != null) {
    return options.dependencies;
  }
  return constructorParameterNames(tree);
}
