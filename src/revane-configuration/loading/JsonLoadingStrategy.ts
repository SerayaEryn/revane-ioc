import { LoadingStrategy } from './LoadingStrategy'
import { promises } from 'fs'
import { all as merge } from 'deepmerge'

const { readFile } = promises

export class JsonLoadingStrategy implements LoadingStrategy {
  async load (configDirectory: string, profile: string): Promise<object> {
    const buffer1 = await readFile(`${configDirectory}/application.json`)
    const defaultConfig = JSON.parse(buffer1.toString())
    let profileConfig
    try {
      const buffer2 = await readFile(`${configDirectory}/application-${profile}.json`)
      profileConfig = JSON.parse(buffer2.toString())
    } catch (ignore) {
      profileConfig = {}
    }
    return merge([defaultConfig, profileConfig])
  }
}
