import { getMetadata } from "../revane-utils/Metadata.js";
import { ApplicationContext } from "./ApplicationContext.js";
import Bean from "./context/bean/Bean.js";
import NotFoundError from "./context/errors/NotFoundError.js";

export class DefaultApplicationContext implements ApplicationContext {
  #parent: ApplicationContext | null;
  #beans: Bean[] = [];
  readonly #indices = new Map<string, Map<any, Bean | Bean[]>>();

  #indexPut(indexName: string, key: any, bean: Bean | Bean[]) {
    if (!this.#indices.has(indexName)) {
      this.#indices.set(indexName, new Map<any, Bean>());
    }
    this.#indices.get(indexName)!.set(key, bean);
  }

  #indexGet(indexName: string, key: any): any | any[] | null {
    return this.#indices.get(indexName)?.get(key) ?? null;
  }

  putSingle(bean: Bean): void {
    this.#beans.push(bean);
    this.#indexPut("id", bean.id(), bean);
    if (bean.classType() != null) {
      this.#indexPut("type", bean.classType(), bean);
    }
  }

  put(beans: Bean[]): void {
    this.#beans = [...this.#beans, ...beans];
    for (const bean of beans) {
      this.#indexPut("id", bean.id(), bean);
      if (bean.classType() != null) {
        this.#indexPut("type", bean.classType(), bean);
      }
    }
  }

  async getByMetadata(metadata: string | symbol): Promise<any[]> {
    let beans: Bean[] | null = this.#indexGet("metadata", metadata);
    if (beans != null) {
      return this.#toInstances(beans as Bean[]);
    }
    beans = [];
    for (const bean of this.#beans) {
      const instance = await bean.getInstance();
      if (getMetadata(metadata, instance.constructor) != null) {
        beans.push(bean);
      }
    }
    this.#indexPut("metadata", metadata, beans);
    return this.#toInstances(beans);
  }

  async getById(id: string): Promise<any> {
    const bean = await this.getBeanById(id);
    return await bean.getInstance();
  }

  async getByClassType(id: string): Promise<any> {
    const bean = await this.getBeanByClassType(id);
    return await bean.getInstance();
  }

  async getBeanById(id: string): Promise<Bean> {
    let bean: Bean | null = this.#indexGet("id", id);
    if (bean != null) {
      return bean;
    }
    bean = (await this.#parent?.getBeanById(id)) ?? null;
    if (bean == null) {
      throw new NotFoundError(id);
    }
    return bean;
  }

  async getBeanByClassType(classType: any): Promise<Bean> {
    let bean = this.#indexGet("type", classType);
    if (bean == null && this.#parent != null) {
      bean = await this.#parent.getBeanByClassType(classType);
    }
    if (bean == null) {
      throw new NotFoundError(classType);
    }
    return bean;
  }

  async getByType(type: string): Promise<any[]> {
    const beansByType: any[] = [];
    for (const bean of this.#beans) {
      if (bean.type() === type) {
        const instance: any = await bean.getInstance();
        beansByType.push(instance);
      }
    }
    return beansByType;
  }

  async hasById(id: string): Promise<boolean> {
    return this.#indexGet("id", id) != null;
  }

  async hasByClassType(classType: any): Promise<boolean> {
    return this.#indexGet("type", classType) != null;
  }

  setParent(parent: ApplicationContext): void {
    this.#parent = parent;
  }

  async close(): Promise<void> {
    if (this.#parent != null) {
      await this.#parent.close();
    }
    for (const bean of this.#beans) {
      await bean.preDestroy();
    }
  }

  async #toInstances(beans: Bean[]): Promise<any[]> {
    const result: any[] = [];
    for (const bean of beans) {
      result.push(await bean.getInstance());
    }
    return result;
  }
}
