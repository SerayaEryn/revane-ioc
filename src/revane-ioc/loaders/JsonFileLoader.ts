'use strict'

import * as fileSystem from 'fs'
import BeanDefinition from '../../revane-ioc-core/BeanDefinition'
import Loader from '../../revane-ioc-core/Loader'
import { FileLoaderOptions } from '../Options'

export default class JsonFileLoader implements Loader {
  private path: string
  static type: string = 'json'

  constructor (options: FileLoaderOptions) {
    this.path = options.file
  }

  public load (): Promise<BeanDefinition[]> {
    return new Promise((resolve, reject) => {
      fileSystem.readFile(this.path, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(data.toString()))
        }
      })
    })
  }

  public static isRelevant (options) {
    return options.file && options.file.endsWith('.json')
  }
}
