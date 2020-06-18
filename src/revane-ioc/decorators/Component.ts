import Options from './Options'
import { Parser } from 'acorn'
import * as classFields from 'acorn-class-fields'
import { dependenciesSym, idSym, typeSym } from './Symbols'

export function createComponentDecorator (type: string) {
  return function decoratoteComponent (options?: Options | string | any) {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (typeof options === 'string' || options === undefined || options.id || options.dependencies) {
      return function define (Class) {
        let opts: Options
        let id: string
        if (typeof options === 'string') {
          id = options
          opts = new Options()
        } else {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          opts = options || new Options()
          id = opts.id
        }

        const tree = getSyntaxTree(Class)

        if (id == null) {
          id = getId(tree)
        }
        const dependencies = getDependencies(tree, opts)
        Reflect.defineMetadata(dependenciesSym, dependencies, Class)
        Reflect.defineMetadata(idSym, id, Class)
        Reflect.defineMetadata(typeSym, type, Class)
        return Class
      }
    } else {
      const tree = getSyntaxTree(options)
      const opts = new Options()
      const id = getId(tree)
      const dependencies = getDependencies(tree, opts)
      Reflect.defineMetadata(dependenciesSym, dependencies, options)
      Reflect.defineMetadata(idSym, id, options)
      Reflect.defineMetadata(typeSym, type, options)
      return options
    }
  }
}

function getSyntaxTree (Class): any {
  const functionAsString = Class.toString()
  return Parser.extend(classFields).parse(functionAsString)
}

function getId (tree): string {
  const className: string = tree.body[0].id.name
  return className.substring(0, 1).toLowerCase() + className.substring(1)
}

function getDependencies (tree, options: Options): string[] {
  if (options.dependencies != null) {
    return options.dependencies
  }

  const functions = tree.body[0].body.body
  for (const funktion of functions) {
    if (isConstructor(funktion)) {
      return funktion.value.params.map((param) => param.name)
    }
  }
  return []
}

function isConstructor (funktion): boolean {
  return funktion.key?.name === 'constructor'
}
