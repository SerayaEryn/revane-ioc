import { JsonLoadingStrategy } from '../revane-configuration/loading/JsonLoadingStrategy.js'
import { PropertiesLoadingStrategy } from '../revane-configuration/loading/PropertiesLoadingStrategy.js'
import { YmlLoadingStrategy } from '../revane-configuration/loading/YmlLoadingStrategy.js'
import { ConfigurationOptions, RevaneConfiguration } from '../revane-configuration/RevaneConfiguration.js'
import { Options } from './RevaneIOC.js'

export function buildConfiguration (options: Options, profile: string): RevaneConfiguration {
  return new RevaneConfiguration(
    new ConfigurationOptions(
      profile,
      options.configurationPath(),
      options.configuration?.required ?? false,
      disabled(options),
      [
        new JsonLoadingStrategy(),
        new YmlLoadingStrategy(),
        new PropertiesLoadingStrategy()
      ],
      options.basePackage
    )
  )
}

function disabled(options: Options): boolean {
  if (options.autoConfiguration) {
    return false
  }
  if (options.configuration?.disabled != null) {
    return options.configuration?.disabled
  }
  return false
}
