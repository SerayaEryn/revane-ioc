'use strict'

import { readFile } from 'fs'
import DefaultBeanDefinition from '../../revane-ioc-core/DefaultBeanDefinition'
import { Dependency } from '../../revane-ioc-core/dependencies/Dependency'
import Loader from '../../revane-ioc-core/Loader'
import { BeanDefinition } from '../RevaneIOC'
import UnknownEndingError from '../UnknownEndingError'
import { JsonFileLoaderOptions } from './JsonFileLoaderOptions'

export default class JsonFileLoader implements Loader {
  public async load (options: JsonFileLoaderOptions[]): Promise<BeanDefinition[]> {
    const promises: Array<Promise<BeanDefinition[]>> = []
    for (const option of options) {
      promises.push(this.loadJsonFile(option))
    }
    const allBeanDefinitions = await Promise.all(promises)
    return allBeanDefinitions.flat()
  }

  private async loadJsonFile (options: JsonFileLoaderOptions): Promise<BeanDefinition[]> {
    const { file } = options
    if (!file.endsWith('.json')) throw new UnknownEndingError()
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
          beanDefinition.dependencyIds = this.toDependencies(rawBeanDefinition)
          return beanDefinition
        })
      })
  }

  public type (): string {
    return 'json'
  }

  private toDependencies (rawBeanDefinition: any): Dependency[] {
    return (rawBeanDefinition.properties ?? [])
      .map((property) => {
        if (property.ref != null) {
          return new Dependency('bean', property.ref)
        } else {
          return new Dependency('value', property.value)
        }
      })
  }
}
