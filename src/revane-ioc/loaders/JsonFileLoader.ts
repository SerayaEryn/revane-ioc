'use strict'

import * as fileSystem from 'fs'
import DefaultBeanDefinition from '../../revane-ioc-core/DefaultBeanDefinition'
import Loader from '../../revane-ioc-core/Loader'
import { LoaderOptions } from '../../revane-ioc-core/Options'

export default class JsonFileLoader implements Loader {
  public load (options: LoaderOptions, basePackage: string): Promise<DefaultBeanDefinition[]> {
    return new Promise((resolve, reject) => {
      fileSystem.readFile(options.file, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(data.toString()))
        }
      })
    })
      .then((beanDefinitions: any[]) => {
        return beanDefinitions.map((rawBeanDefinition) => {
          const beanDefinition = new DefaultBeanDefinition(rawBeanDefinition.id)
          beanDefinition.class = rawBeanDefinition.class
          beanDefinition.dependencyIds = rawBeanDefinition.properties || []
          return beanDefinition
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
