import { ApplicationContext } from './ApplicationContext.js'
import Bean from './context/bean/Bean.js'
import NotFoundError from './context/errors/NotFoundError.js'

export class DefaultApplicationContext implements ApplicationContext {
  private parent: ApplicationContext | null
  private readonly beansById = new Map<string, Bean>()
  private readonly beansByType = new Map<any, Bean>()

  put (beans: Bean[]): void {
    for (const bean of beans) {
      this.beansById.set(bean.id(), bean)
      if (bean.classType() != null) {
        this.beansByType.set(bean.classType(), bean)
      }
    }
  }

  async getById (id: string): Promise<any> {
    const bean = await this.getBeanById(id)
    return await bean.getInstance()
  }

  async getByClassType (id: string): Promise<any> {
    const bean = await this.getBeanByClassType(id)
    return await bean.getInstance()
  }

  async getBeanById (id: string): Promise<Bean> {
    let bean = this.beansById.get(id)
    if (bean == null && this.parent != null) {
      bean = await this.parent.getBeanById(id)
    }
    if (bean == null) {
      throw new NotFoundError(id)
    }
    return bean
  }

  async getBeanByClassType (classType: any): Promise<Bean> {
    let bean = this.beansByType.get(classType)
    if (bean == null && this.parent != null) {
      bean = await this.parent.getBeanByClassType(classType)
    }
    if (bean == null) {
      throw new NotFoundError(classType)
    }
    return bean
  }

  async getByType (type: string): Promise<any[]> {
    const beansByType: any[] = []
    for (const bean of this.beansById.values()) {
      if (bean.type() === type) {
        const instance: any = await bean.getInstance()
        beansByType.push(instance)
      }
    }
    return beansByType
  }

  async hasById (id: string): Promise<boolean> {
    return this.beansById.has(id)
  }

  async hasByClassType (classType: any): Promise<boolean> {
    return this.beansByType.has(classType)
  }

  setParent (context: ApplicationContext): void {
    this.parent = context
  }

  async close (): Promise<void> {
    for (const bean of this.beansById.values()) {
      await bean.preDestroy()
    }
  }
}
