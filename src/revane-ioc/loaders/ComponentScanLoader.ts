'use strict'

import * as flat from 'array.prototype.flat'
import 'reflect-metadata'
import DefaultBeanDefinition from '../../revane-ioc-core/DefaultBeanDefinition'
import Filter from './Filter'
import RegexFilter from './RegexFilter'
import Loader from '../../revane-ioc-core/Loader'

import * as recursiveReaddir from 'recursive-readdir'
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

const filterByType = {
  regex: RegexFilter
}

export default class ComponentScanLoader implements Loader {
  public async load (options: LoaderOptions, basePackage: string): Promise<BeanDefinition[]> {
    const path = options.basePackage
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const includeFilters = convert(options.includeFilters || [])
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const excludeFilters = convert(options.excludeFilters || [])

    return recursiveReaddir(path)
      .then(flat)
      .then((files: string[]) => filterByJavascriptFiles(files))
      .then((files: string[]) => {
        const filteredFiles = this.applyFilters(files, includeFilters, excludeFilters)
        const result = []
        for (const file of filteredFiles) {
          let module1
          try {
            module1 = getClazz(file)
          } catch (error) {
            throw new ModuleLoadError(file)
          }
          const clazz = file.replace(basePackage, '.')
          const beanDefinition = getBeanDefinition(module1, clazz)
          result.push(beanDefinition)
        }
        return result
      })
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
}

function getClazz (file: string): any {
  const module1: any = require(file) // eslint-disable-line
  if (module1.default != null) {
    return module1.default
  }
  return module1
}

function getBeanDefinition (module1, clazz): DefaultBeanDefinition {
  const id = Reflect.getMetadata(idSym, module1)
  const type = Reflect.getMetadata(typeSym, module1)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const scope = Reflect.getMetadata(scopeSym, module1) || 'singleton'
  const dependencies = Reflect.getMetadata(dependenciesSym, module1).map(toReference)
  const beanDefinition = new DefaultBeanDefinition(id)
  beanDefinition.class = clazz
  beanDefinition.dependencyIds = dependencies
  beanDefinition.scope = scope
  beanDefinition.type = type
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
