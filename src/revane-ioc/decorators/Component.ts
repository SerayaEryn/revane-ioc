import Options from './Options'
import * as esprima from 'esprima'

export function createComponentDecorator (type: string) {
  return function decoratoteComponent (options?: Options | string | any) {
    if (typeof options === 'string' || options === undefined || options.id || options.dependencies) {
      return function define (Class) {
        let opts: Options
        let id: string
        if (typeof options === 'string') {
          id = options
          opts = new Options()
        } else {
          opts = options || new Options()
          id = opts.id
        }

        const tree = getSyntaxTree(Class)

        if (!id) {
          id = getId(tree)
        }
        const dependencies = getDependencies(tree, opts)
        Reflect.defineMetadata('dependencies', dependencies, Class)
        Reflect.defineMetadata('id', id, Class)
        Reflect.defineMetadata('type', type, Class)
        return Class
      }
    } else {
      const tree = getSyntaxTree(options)
      const opts = new Options()
      const id = getId(tree)
      const dependencies = getDependencies(tree, opts)
      Reflect.defineMetadata('dependencies', dependencies, options)
      Reflect.defineMetadata('id', id, options)
      Reflect.defineMetadata('type', type, options)
      return options
    }
  }
}

function getSyntaxTree (Class) {
  const functionAsString = Class.toString()
  return esprima.parse(functionAsString)
}

function getId (tree) {
  const className = tree.body[0].id.name
  return className.substring(0, 1).toLowerCase() + className.substring(1)
}

function getDependencies (tree, options: Options) {
  if (options.dependencies) {
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

function isConstructor (funktion) {
  return funktion.key && funktion.key.name === 'constructor'
}
