'use strict'

import * as fileSystem from 'fs'
import BeanDefinition from '../../revane-ioc-core/BeanDefinition'
import Loader from '../../revane-ioc-core/Loader'
import { LoaderOptions } from '../../revane-ioc-core/Options'

export default class JsonFileLoader implements Loader {
  private path: string
  static type: string = 'json'

  constructor (options: LoaderOptions, basePackage: string) {
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

  public static isRelevant (options: LoaderOptions): boolean {
    return options.file && options.file.endsWith('.json')
  }
}
