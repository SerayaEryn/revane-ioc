import { configurationPropertiesSym } from './Symbols'
import { Parser } from 'acorn'
import * as classFields from 'acorn-class-fields'
import { Reflect } from '../revane-utils/Reflect'

export type ConfigurationPropertiesOptions = {
  prefix: string
}

function createConfigurationPropertiesDecorator () {
  return function decoratoteConfigurationProperties (options: ConfigurationPropertiesOptions) {
    return function define (Class) {
      const tree = getSyntaxTree(Class)
      const properties: string[] = tree.body[0].body.body
        .filter((node) => node.type === 'PropertyDefinition')
        .map((node) => node.key.name)
      Reflect.defineMetadata(
        configurationPropertiesSym,
        new ConfigurationPropertiesData(options.prefix, properties),
        Class
      )
      return Class
    }
  }
}

export class ConfigurationPropertiesData {
  public prefix: string
  public properties: string[]

  constructor (prefix: string, properties: string[]) {
    this.prefix = prefix
    this.properties = properties
  }
}

function getSyntaxTree (Class): any {
  const functionAsString = Class.toString()
  return Parser.extend(classFields).parse(
    functionAsString, { ecmaVersion: 2020 }
  )
}

const ConfigurationProperties = createConfigurationPropertiesDecorator()

export {
  ConfigurationProperties
}
