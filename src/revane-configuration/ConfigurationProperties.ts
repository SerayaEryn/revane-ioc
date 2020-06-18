import { configurationPropertiesSym } from './Symbols'
import { Parser } from 'acorn'
import * as classFields from 'acorn-class-fields'

export type ConfigurationPropertiesOptions = {
  prefix: string
}

function createConfigurationPropertiesDecorator () {
  return function decoratoteConfigurationProperties (options: ConfigurationPropertiesOptions) {
    return function define (Class) {
      const tree = getSyntaxTree(Class)
      const properties: string[] = tree.body[0].body.body
        .filter((node) => node.type === 'FieldDefinition')
        .map((node) => node.key.name)
      Reflect.defineMetadata(configurationPropertiesSym, {
        prefix: options.prefix,
        properties
      }, Class)
      return Class
    }
  }
}

function getSyntaxTree (Class): any {
  const functionAsString = Class.toString()
  return Parser.extend(classFields).parse(functionAsString)
}

const ConfigurationProperties = createConfigurationPropertiesDecorator()

export {
  ConfigurationProperties
}
