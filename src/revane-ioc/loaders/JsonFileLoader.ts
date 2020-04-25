'use strict'

import * as fileSystem from 'fs'
import BeanDefinition from '../../revane-ioc-core/BeanDefinition'
import Loader from '../../revane-ioc-core/Loader'
import { LoaderOptions } from '../../revane-ioc-core/Options'

export default class JsonFileLoader implements Loader {
  public load (options: LoaderOptions, basePackage: string): Promise<BeanDefinition[]> {
    return new Promise((resolve, reject) => {
      fileSystem.readFile(options.file, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(data.toString()))
        }
      })
    })
  }

  public isRelevant (options: LoaderOptions): boolean {
    return options.file && options.file.endsWith('.json')
  }

  public type (): string {
    return 'json'
  }
}
