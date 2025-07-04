import { XMLParser } from "fast-xml-parser";
import { readFile } from "node:fs/promises";
import DefaultBeanDefinition from "../../revane-ioc-core/DefaultBeanDefinition.js";
import Loader from "../../revane-ioc-core/Loader.js";
import { BeanDefinition } from "../RevaneIOC.js";
import {
  ALIAS_VALUE,
  PROTOTYPE_VALUE,
  SINGLETON_VALUE,
} from "../../revane-ioc-core/Scopes.js";
import { XmlFileLoaderOptions } from "./XmlFileLoaderOptions.js";
import UnknownEndingError from "../UnknownEndingError.js";
import { DependencyDefinition } from "../../revane-ioc-core/dependencies/DependencyDefinition.js";
import { isArray } from "../../revane-utils/TypeUtil.js";

const xmlParserOptions = {
  allowBooleanAttributes: false,
  attrNodeName: "attr",
  attributeNamePrefix: "",
  ignoreAttributes: false,
  ignoreNameSpace: false,
  parseAttributeValue: false,
  parseNodeValue: true,
};

interface XmlReferenceAttribute {
  bean?: string;
  value?: string;
}

interface XmlReference {
  attr: XmlReferenceAttribute;
}

interface XmlAttribute {
  class?: string;
  scope?: typeof SINGLETON_VALUE | typeof PROTOTYPE_VALUE | typeof ALIAS_VALUE;
  type?: string;
  id?: string;
  "base-package"?: string;
}

interface XmlBean {
  attr: XmlAttribute;
  ref?: XmlReference;
}

interface XmlBeans {
  bean?: XmlBean[] | XmlBean;
  "context:component-scan"?: XmlBean;
}

interface Xml {
  beans: XmlBeans;
}

export default class XmlFileLoader implements Loader {
  static type = "xml";

  constructor() {
    this.toBeanDefinition = this.toBeanDefinition.bind(this);
  }

  public async load(
    options: XmlFileLoaderOptions[],
  ): Promise<BeanDefinition[]> {
    const promises: Promise<BeanDefinition[]>[] = [];
    for (const option of options) {
      promises.push(this.loadXmlFile(option));
    }
    const allBeanDefinitions = await Promise.all(promises);
    return allBeanDefinitions.flat();
  }

  private async loadXmlFile(
    options: XmlFileLoaderOptions,
  ): Promise<DefaultBeanDefinition[]> {
    const { file } = options;
    if (!file.endsWith(".xml")) throw new UnknownEndingError();
    const data = await readFile(file);
    const parserOptions = {
      ignoreAttributes: false,
      attributeNamePrefix: "",
      attributesGroupName: "attr",
    };
    const xmlParser = new XMLParser(parserOptions);
    const result: Xml = xmlParser.parse(data.toString(), xmlParserOptions);

    let beanDefinitions: DefaultBeanDefinition[] = [];
    const beans = result.beans;

    if (beans.bean == null) {
      return beanDefinitions;
    }
    if (isArray(beans.bean)) {
      beanDefinitions = beanDefinitions
        .filter((it) => (it as any) !== "")
        .concat(beans.bean.map(this.toBeanDefinition));
    } else {
      beanDefinitions.push(this.toBeanDefinition(beans.bean));
    }
    return beanDefinitions;
  }

  public type(): string {
    return "xml";
  }

  private toBeanDefinition(bean: XmlBean): DefaultBeanDefinition {
    const id = bean.attr.id;
    if (id == null) throw new Error("Missing id");
    const beanDefinition = new DefaultBeanDefinition(id);
    const clazz = bean.attr.class;
    if (clazz == null) throw new Error("missing class");
    beanDefinition.class = clazz;
    beanDefinition.scope = bean.attr.scope ?? SINGLETON_VALUE;
    if (bean.attr.type != null) {
      beanDefinition.type = bean.attr.type;
    }
    const ref = bean.ref;
    if (ref != null) {
      beanDefinition.dependencyIds = this.getProperties(ref);
    } else {
      beanDefinition.dependencyIds = [];
    }
    return beanDefinition;
  }

  private getProperties(ref: XmlReference): DependencyDefinition[] {
    let properties: DependencyDefinition[] = [];
    if (ref != null) {
      if (isArray(ref)) {
        properties = ref.map(toReference);
      } else {
        properties = [toReference(ref)];
      }
    }
    return properties;
  }
}

function toReference(ref: XmlReference): DependencyDefinition {
  if (ref.attr.bean != null) {
    return new DependencyDefinition("bean", ref.attr.bean, null);
  } else {
    return new DependencyDefinition("value", ref.attr.value, null);
  }
}
