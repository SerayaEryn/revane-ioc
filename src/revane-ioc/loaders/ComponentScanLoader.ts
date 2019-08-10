'use strict'

import * as flat from 'array.prototype.flat'
import 'reflect-metadata'
import BeanDefinition from '../../revane-ioc-core/BeanDefinition'
import Filter from './Filter'
import RegexFilter from './RegexFilter'
import Loader from '../../revane-ioc-core/Loader'

import * as recursiveReaddir from 'recursive-readdir'
import {
  idSym, typeSym, scopeSym, dependenciesSym, injectSym
} from '../decorators/Symbols'
import { Property } from '../../revane-ioc-core/context/Container'
import { LoaderOptions } from '../../revane-ioc-core/Options'

const filterByType = {
  regex: RegexFilter
}

export default class ComponentScanLoader implements Loader {
  private basePackage: string
  private includeFilters: Filter[]
  private excludeFilters: Filter[]
  static type: string = 'scan'

  constructor (options: LoaderOptions, basePackage: string) {
    this.basePackage = options.basePackage
    this.includeFilters = convert(options.includeFilters || [])
    this.excludeFilters = convert(options.excludeFilters || [])
  }

  public load (): Promise<BeanDefinition[]> {
    return recursiveReaddir(this.basePackage)
      .then((files: string[]) => {
        const flattenFiles = flat(files)
        let filteredFiles = filterByJavascriptFiles(flattenFiles)
        filteredFiles = this.applyFilters(filteredFiles)
        const result = []
        for (const file of filteredFiles) {
          let module1 = getClazz(file)
          const clazz = file.replace(this.basePackage, '.')
          if (module1 && Reflect.getMetadata(idSym, module1)) {
            const beanDefinition = getBeanDefinition(module1, clazz)
            result.push(beanDefinition)
          }
        }
        return result
      })
  }

  public static isRelevant (options: LoaderOptions) {
    return options.componentScan
  }

  private applyFilters (files: string[]): string[] {
    let filtered = files
    for (const filter of this.includeFilters) {
      filtered = filtered.filter((def) => filter.applies(def))
    }
    for (const filter of this.excludeFilters) {
      filtered = filtered.filter((def) => !filter.applies(def))
    }
    return filtered
  }
}

function getClazz (file: string): any {
  let module1 = require(file)
  if (module1.default) {
    return module1.default
  }
  return module1
}

function getBeanDefinition (module1, clazz): BeanDefinition {
  const id = Reflect.getMetadata(idSym, module1)
  const type = Reflect.getMetadata(typeSym, module1)
  const scope = Reflect.getMetadata(scopeSym, module1) || 'singleton'
  const dependencies = Reflect.getMetadata(dependenciesSym, module1).map(toReference)
  const inject = Reflect.getMetadata(injectSym, module1)
  const beanDefinition = new BeanDefinition(id)
  beanDefinition.class = clazz
  beanDefinition.properties = dependencies
  beanDefinition.scope = scope
  beanDefinition.type = type
  beanDefinition.options = {
    inject
  }
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
