'use strict'

import { readFile } from 'fs'
import DefaultBeanDefinition from '../../revane-ioc-core/DefaultBeanDefinition'
import Loader from '../../revane-ioc-core/Loader'
import { LoaderOptions } from '../../revane-ioc-core/Options'

export default class JsonFileLoader implements Loader {
  public async load (options: LoaderOptions, basePackage: string): Promise<DefaultBeanDefinition[]> {
    const file = options.file
    if (file == null) return []
    return await new Promise((resolve, reject) => {
      readFile(file, (error, data) => {
        if (error != null) {
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
          beanDefinition.dependencyIds = rawBeanDefinition.properties ?? []
          return beanDefinition
        })
      })
  }

  public isRelevant (options: LoaderOptions): boolean {
    if (options.file == null) return false
    return options.file.endsWith('.json')
  }

  public type (): string {
    return 'json'
  }
}
