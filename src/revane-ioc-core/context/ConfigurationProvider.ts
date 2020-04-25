import { Configuration } from './Configuration'

export interface ConfigurationProvider {
  provide (): Configuration | null
  init (): Promise<void>
}
