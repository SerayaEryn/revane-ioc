import { JsonLoadingStrategy } from './loading/JsonLoadingStrategy.js'
import { PropertiesLoadingStrategy } from './loading/PropertiesLoadingStrategy.js'
import { YmlLoadingStrategy } from './loading/YmlLoadingStrategy.js'
import { ConfigurationOptions, RevaneConfiguration } from './RevaneConfiguration.js'
import { Options } from '../revane-ioc/RevaneIOC.js'

export function buildConfiguration (options: Options, profile: string | null): RevaneConfiguration {
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
