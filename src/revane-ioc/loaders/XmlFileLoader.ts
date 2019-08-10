'use strict'

import * as fastXmlParser from 'fast-xml-parser'
import * as fileSystem from 'fs'
import BeanDefinition from '../../revane-ioc-core/BeanDefinition'
import Loader from '../../revane-ioc-core/Loader'
import { Property } from '../../revane-ioc-core/context/Container'
import { LoaderOptions } from '../../revane-ioc-core/Options'

const options = {
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
  class: string
  type: string
  id: string
}

type XmlBean = {
  attr: XmlAttribute
  ref: XmlReference
}

type XmlBeans = {
  bean: XmlBean[] | XmlBean
}

type Xml = {
  beans: XmlBeans
}

export default class XmlFileLoader implements Loader {
  private path: string
  static type: string = 'xml'

  constructor (options: LoaderOptions) {
    this.path = options.file
  }

  public load (): Promise<BeanDefinition[]> {
    return new Promise((resolve, reject) => {
      fileSystem.readFile(this.path, (error, data) => {
        if (error) {
          reject(error)
        } else {
          const result: Xml = fastXmlParser.parse(data.toString(), options)
          let beanDefinitions: BeanDefinition[]
          if (Array.isArray(result.beans.bean)) {
            beanDefinitions = result.beans.bean.map(toBeanDefinition)
          } else {
            beanDefinitions = [toBeanDefinition(result.beans.bean)]
          }
          resolve(beanDefinitions)
        }
      })
    })
  }

  public static isRelevant (options: LoaderOptions): boolean {
    return options.file && options.file.endsWith('.xml')
  }
}

function toBeanDefinition (bean: XmlBean): BeanDefinition {
  const beanDefinition = new BeanDefinition(bean.attr.id)
  beanDefinition.class = bean.attr.class
  if (bean.attr.type) {
    beanDefinition.type = bean.attr.type
  }
  const ref = bean.ref
  beanDefinition.properties = getProperties(ref)
  return beanDefinition
}

function getProperties (ref: XmlReference): Property[] {
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

function toReference (ref: XmlReference): Property {
  if (ref.attr.bean) {
    return { ref: ref.attr.bean }
  } else {
    return { value: ref.attr.value }
  }
}
