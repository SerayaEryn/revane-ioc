'use strict'

import DefaultBeanDefinition from '../../revane-ioc-core/DefaultBeanDefinition'
import Filter from './Filter'
import RegexFilter from './RegexFilter'
import Loader from '../../revane-ioc-core/Loader'

import {
  idSym,
  typeSym,
  scopeSym,
  dependenciesSym
} from '../decorators/Symbols'
import { LoaderOptions } from '../../revane-ioc-core/Options'
import { Property } from '../../revane-ioc-core/Property'
import { ModuleLoadError } from './ModuleLoadError'
import { BeanDefinition } from '../../revane-ioc-core/BeanDefinition'
import { Reflect } from '../../revane-utils/Reflect'
import { recursiveReaddir } from './RecursiveReadDir'
import { Scope } from '../../revane-ioc-core/Scope'

const filterByType = {
  regex: RegexFilter
}

export default class ComponentScanLoader implements Loader {
  public async load (options: LoaderOptions, basePackage: string): Promise<BeanDefinition[]> {
    const path = options.basePackage
    const includeFilters = convert(options.includeFilters || [])
    const excludeFilters = convert(options.excludeFilters || [])
    const files = await recursiveReaddir(path)
    const flatFiles = files.flat()
    const filesFilteredByJavascript = filterByJavascriptFiles(flatFiles)
    const filesFilteredByPackage = this.filterByPackage(filesFilteredByJavascript)
    const filteredFiles = this.applyFilters(filesFilteredByPackage, includeFilters, excludeFilters)
    const result: BeanDefinition[] = []
    for (const file of filteredFiles) {
      let requiredFile: any
      let moduleMap: Map<string, any>
      try {
        requiredFile = require(file) // eslint-disable-line
        moduleMap = getModuleMap(requiredFile)
      } catch (error) {
        throw new ModuleLoadError(file, error)
      }
      if (moduleMap.size === 0) {
        if (this.isNoComponent(requiredFile)) {
          continue
        }
        const clazz = file.replace(basePackage, '.')
        result.push(getBeanDefinition(null, requiredFile, clazz))
      } else {
        for (const key of moduleMap.keys()) {
          const aModule = moduleMap.get(key)
          if (this.isNoComponent(aModule)) {
            continue
          }
          const clazz = file.replace(basePackage, '.')
          result.push(getBeanDefinition(key, aModule, clazz))
        }
      }
    }
    return result
  }

  private isNoComponent (aModule: any): boolean {
    return Reflect.getMetadata(idSym, aModule) == null
  }

  public isRelevant (options: LoaderOptions): boolean {
    return options.componentScan
  }

  public type (): string {
    return 'scan'
  }

  private applyFilters (
    files: string[],
    includeFilters: Filter[],
    excludeFilters: Filter[]): string[] {
    let filtered = files
    for (const filter of includeFilters) {
      filtered = filtered.filter((def) => filter.applies(def))
    }
    for (const filter of excludeFilters) {
      filtered = filtered.filter((def) => !filter.applies(def))
    }
    return filtered
  }

  private filterByPackage (files: string[]): string[] {
    return files.filter(file => !file.includes('/node_modules'))
  }
}

function getModuleMap (requiredFile: any): Map<string, any> {
  const moduleMap: Map<string, any> = new Map()
  for (const key of Object.keys(requiredFile)) {
    moduleMap.set(key, requiredFile[key])
  }
  return moduleMap
}

function getBeanDefinition (key: string, module1: any, clazz): DefaultBeanDefinition {
  const id = Reflect.getMetadata(idSym, module1)
  const type = Reflect.getMetadata(typeSym, module1)
  const scope = Reflect.getMetadata(scopeSym, module1) || Scope.SINGLETON
  const dependencies = Reflect.getMetadata(dependenciesSym, module1).map(toReference)
  const beanDefinition = new DefaultBeanDefinition(id)
  beanDefinition.class = clazz
  beanDefinition.dependencyIds = dependencies
  beanDefinition.scope = scope
  beanDefinition.type = type
  beanDefinition.key = key
  return beanDefinition
}

function toReference (id: string): Property {
  return {
    ref: id
  }
}

function filterByJavascriptFiles (files: string[]): string[] {
  const filteredFiles = []
  for (const file of files) {
    if (file.endsWith('.js')) {
      filteredFiles.push(file)
    }
  }
  return filteredFiles
}

function convert (filters): Filter[] {
  return filters.map((filter) => new filterByType[filter.type](filter))
}
