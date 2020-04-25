'use strict'

import * as fastXmlParser from 'fast-xml-parser'
import * as fileSystem from 'fs'
import BeanDefinition from '../../revane-ioc-core/BeanDefinition'
import Loader from '../../revane-ioc-core/Loader'
import { Property } from '../../revane-ioc-core/context/Container'
import { LoaderOptions } from '../../revane-ioc-core/Options'
import { join } from 'path'
import ComponentScanLoader from './ComponentScanLoader'

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
  id?: string,
  'base-package'?: string
}

type XmlBean = {
  attr?: XmlAttribute
  ref?: XmlReference
}

type XmlBeans = {
  bean?: XmlBean[] | XmlBean,
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

  public async load (options: LoaderOptions, basePackage: string): Promise<BeanDefinition[]> {
    const data = await this.loadFile(options.file)
    const result: Xml = fastXmlParser.parse(data.toString(), xmlParserOptions)

    let beanDefinitions: BeanDefinition[] = []
    const beans = result.beans
    if (beans['component-scan'] || beans['context:component-scan']) {
      const moreBeanDefinitions = await this.performScan(beans, basePackage)
      beanDefinitions = beanDefinitions.concat(moreBeanDefinitions)
    }

    if (!beans.bean) {
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

  private async loadFile (file: string) {
    return new Promise((resolve, reject) => {
      fileSystem.readFile(file, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  private async performScan (beans: XmlBeans, basePackage: string) {
    const componentScan = beans['component-scan'] || beans['context:component-scan']
    const relativePath = componentScan.attr['base-package']
    const directory = join(basePackage, relativePath)
    const componentScanLoader = new ComponentScanLoader()
    return componentScanLoader.load({ basePackage: directory }, basePackage)
  }

  public isRelevant (options: LoaderOptions): boolean {
    return options.file && options.file.endsWith('.xml')
  }

  private toBeanDefinition (bean: XmlBean): BeanDefinition {
    const beanDefinition = new BeanDefinition(bean.attr.id)
    beanDefinition.class = bean.attr.class
    beanDefinition.scope = bean.attr.scope || 'singleton'
    if (bean.attr.type) {
      beanDefinition.type = bean.attr.type
    }
    const ref = bean.ref
    beanDefinition.properties = this.getProperties(ref)
    return beanDefinition
  }

  private getProperties (ref: XmlReference): Property[] {
    let properties: Property[] = []
    if (ref) {
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
  if (ref.attr.bean) {
    return { ref: ref.attr.bean }
  } else {
    return { value: ref.attr.value }
  }
}
