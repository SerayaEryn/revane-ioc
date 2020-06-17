import { ApplicationContext } from './ApplicationContext'
import Bean from './context/bean/Bean'
import NotFoundError from './context/errors/NotFoundError'

export class DefaultApplicationContext implements ApplicationContext {
  private parent: ApplicationContext
  private beans: Map<string, Bean> = new Map()

  put (beans: Bean[]): void {
    for (const bean of beans) {
      this.beans.set(bean.id(), bean)
    }
  }

  async get (id: string): Promise<any> {
    let bean = await this.getBean(id)
    return bean.getInstance()
  }

  async getBean (id: string): Promise<Bean> {
    let bean = this.beans.get(id)
    if (!bean && this.parent) {
      bean = await this.parent.getBean(id)
    }
    if (!bean) {
      throw new NotFoundError(id)
    }
    return bean
  }

  async getByType (type: string): Promise<any[]> {
    const beansByType = []
    for (const bean of this.beans.values()) {
      if (bean.type() === type) {
        const instance = await bean.getInstance()
        beansByType.push(instance)
      }
    }
    return beansByType
  }

  async has (id: string): Promise<boolean> {
    return this.beans.has(id)
  }

  setParent (context: ApplicationContext): void {
    this.parent = context
  }

  async refresh (): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async close (): Promise<void> {
    for (const bean of this.beans.values()) {
      await bean.preDestroy()
    }
  }
}
