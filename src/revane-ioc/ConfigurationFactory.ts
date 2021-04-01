import { JsonLoadingStrategy } from '../revane-configuration/loading/JsonLoadingStrategy'
import { PropertiesLoadingStrategy } from '../revane-configuration/loading/PropertiesLoadingStrategy'
import { YmlLoadingStrategy } from '../revane-configuration/loading/YmlLoadingStrategy'
import { ConfigurationOptions, RevaneConfiguration } from '../revane-configuration/RevaneConfiguration'
import { Options } from './RevaneIOC'

export function buildConfiguration (options: Options, profile: string): RevaneConfiguration {
  return new RevaneConfiguration(
    new ConfigurationOptions(
      profile,
      options.configurationPath(),
      options.configuration?.required ?? false,
      options.autoConfiguration ?? options.configuration?.disabled ?? false,
      [
        new JsonLoadingStrategy(),
        new YmlLoadingStrategy(),
        new PropertiesLoadingStrategy()
      ],
      options.basePackage
    )
  )
}
