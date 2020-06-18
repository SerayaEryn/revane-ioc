'use strict'

import * as fastXmlParser from 'fast-xml-parser'
import * as fileSystem from 'fs'
import DefaultBeanDefinition from '../../revane-ioc-core/DefaultBeanDefinition'
import Loader from '../../revane-ioc-core/Loader'
import { LoaderOptions } from '../../revane-ioc-core/Options'
import { join } from 'path'
import ComponentScanLoader from './ComponentScanLoader'
import { Property } from '../../revane-ioc-core/Property'
import { BeanDefinition } from '../RevaneIOC'

const xmlParserOptions = {
  allowBooleanAttributes: false,
  attrNodeName: 'attr',
  attributeNamePrefix: '',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  parseAttributeValue: false,
  parseNodeValue: true
}

type XmlReferenceAttribute = {
  bean?: string
  value?: string
}

type XmlReference = {
  attr: XmlReferenceAttribute
}

type XmlAttribute = {
  class?: string
  scope?: string
  type?: string
  id?: string
  'base-package'?: string
}

type XmlBean = {
  attr?: XmlAttribute
  ref?: XmlReference
}

type XmlBeans = {
  bean?: XmlBean[] | XmlBean
  'context:component-scan'?: XmlBean
}

type Xml = {
  beans: XmlBeans
}

export default class XmlFileLoader implements Loader {
  static type: string = 'xml'

  constructor () {
    this.toBeanDefinition = this.toBeanDefinition.bind(this)
  }

  public async load (options: LoaderOptions, basePackage: string): Promise<DefaultBeanDefinition[]> {
    const data = await this.loadFile(options.file)
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
    return await componentScanLoader.load({ basePackage: directory }, basePackage)
  }

  public isRelevant (options: LoaderOptions): boolean {
    return options.file?.endsWith('.xml')
  }

  private toBeanDefinition (bean: XmlBean): DefaultBeanDefinition {
    const beanDefinition = new DefaultBeanDefinition(bean.attr.id)
    beanDefinition.class = bean.attr.class
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    beanDefinition.scope = bean.attr.scope || 'singleton'
    if (bean.attr.type != null) {
      beanDefinition.type = bean.attr.type
    }
    const ref = bean.ref
    beanDefinition.dependencyIds = this.getProperties(ref)
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
