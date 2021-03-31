'use strict'

import * as fastXmlParser from 'fast-xml-parser'
import * as fileSystem from 'fs'
import DefaultBeanDefinition from '../../revane-ioc-core/DefaultBeanDefinition'
import Loader from '../../revane-ioc-core/Loader'
import { join } from 'path'
import ComponentScanLoader from './ComponentScanLoader'
import { Property } from '../../revane-ioc-core/Property'
import { BeanDefinition } from '../RevaneIOC'
import { Scope } from '../../revane-ioc-core/Scope'
import { XmlFileLoaderOptions } from './XmlFileLoaderOptions'
import UnknownEndingError from '../UnknownEndingError'
import { ComponentScanLoaderOptions } from './ComponentScanLoaderOptions'

const xmlParserOptions = {
  allowBooleanAttributes: false,
  attrNodeName: 'attr',
  attributeNamePrefix: '',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  parseAttributeValue: false,
  parseNodeValue: true
}

interface XmlReferenceAttribute {
  bean?: string
  value?: string
}

interface XmlReference {
  attr: XmlReferenceAttribute
}

interface XmlAttribute {
  class?: string
  scope?: string
  type?: string
  id?: string
  'base-package'?: string
}

interface XmlBean {
  attr: XmlAttribute
  ref?: XmlReference
}

interface XmlBeans {
  bean?: XmlBean[] | XmlBean
  'context:component-scan'?: XmlBean
}

interface Xml {
  beans: XmlBeans
}

export default class XmlFileLoader implements Loader {
  static type: string = 'xml'

  constructor () {
    this.toBeanDefinition = this.toBeanDefinition.bind(this)
  }

  public async load (options: XmlFileLoaderOptions[]): Promise<BeanDefinition[]> {
    const promises: Array<Promise<BeanDefinition[]>> = []
    for (const option of options) {
      promises.push(this.loadXmlFile(option))
    }
    const allBeanDefinitions = await Promise.all(promises)
    return allBeanDefinitions.flat()
  }

  private async loadXmlFile (options: XmlFileLoaderOptions): Promise<DefaultBeanDefinition[]> {
    const { file, basePackage } = options
    if (!file.endsWith('.xml')) throw new UnknownEndingError()
    const data = await this.loadFile(file)
    const result: Xml = fastXmlParser.parse(data.toString(), xmlParserOptions)

    let beanDefinitions: DefaultBeanDefinition[] = []
    const beans = result.beans
    if (beans['component-scan'] != null || beans['context:component-scan'] != null) {
      const moreBeanDefinitions = await this.performScan(beans, basePackage)
      beanDefinitions = beanDefinitions.concat(moreBeanDefinitions)
    }

    if (beans.bean == null) {
      return beanDefinitions
    }
    if (Array.isArray(beans.bean)) {
      beanDefinitions = beanDefinitions.concat(beans.bean.map(this.toBeanDefinition))
    } else {
      beanDefinitions.push(this.toBeanDefinition(beans.bean))
    }
    return beanDefinitions
  }

  public type (): string {
    return 'xml'
  }

  private async loadFile (file: string): Promise<Buffer> {
    return await new Promise((resolve, reject) => {
      fileSystem.readFile(file, (error, data: Buffer) => {
        if (error != null) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  private async performScan (beans: XmlBeans, basePackage: string): Promise<BeanDefinition[]> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const componentScan = beans['component-scan'] || beans['context:component-scan']
    const relativePath = componentScan.attr['base-package']
    const directory = join(basePackage, relativePath)
    const componentScanLoader = new ComponentScanLoader()
    return await componentScanLoader.load(
      [new ComponentScanLoaderOptions(directory, null, null)]
    )
  }

  private toBeanDefinition (bean: XmlBean): DefaultBeanDefinition {
    const id = bean.attr.id
    if (id == null) throw new Error('Missing id')
    const beanDefinition = new DefaultBeanDefinition(id)
    const clazz = bean.attr.class
    if (clazz == null) throw new Error('missing class')
    beanDefinition.class = clazz
    beanDefinition.scope = bean.attr.scope ?? Scope.SINGLETON
    if (bean.attr.type != null) {
      beanDefinition.type = bean.attr.type
    }
    const ref = bean.ref
    if (ref != null) {
      beanDefinition.dependencyIds = this.getProperties(ref)
    } else {
      beanDefinition.dependencyIds = []
    }
    return beanDefinition
  }

  private getProperties (ref: XmlReference): Property[] {
    let properties: Property[] = []
    if (ref != null) {
      if (Array.isArray(ref)) {
        properties = ref.map(toReference)
      } else {
        properties = [toReference(ref)]
      }
    }
    return properties
  }
}

function toReference (ref: XmlReference): Property {
  if (ref.attr.bean != null) {
    return { ref: ref.attr.bean }
  } else {
    return { value: ref.attr.value }
  }
}
