import {
  ClassDeclaration,
  Identifier,
  MethodDefinition,
  Parser,
  PrivateIdentifier,
  Program,
  StaticBlock,
  PropertyDefinition,
} from "acorn";

export function constructorParameterNames(tree: Program) {
  const functions = (tree.body as ClassDeclaration[])[0].body.body;
  for (const funktion of functions) {
    if (isConstructor(funktion)) {
      return (funktion as MethodDefinition).value.params.map(
        (param: Identifier) => param.name,
      );
    }
  }
  return [];
}

export function getSyntaxTree(Class): Program {
  const functionAsString: string = Class.toString();
  return Parser.parse(functionAsString, { ecmaVersion: 2023 });
}

function isConstructor(
  funktion: MethodDefinition | PropertyDefinition | StaticBlock,
): boolean {
  return (
    ((funktion as MethodDefinition).key as PrivateIdentifier)?.name ===
    "constructor"
  );
}
