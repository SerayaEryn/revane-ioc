import Bean from './context/bean/Bean'

export interface ApplicationContext {
  get (id: string): Promise<any>
  getBean (id: string): Promise<Bean>
  has (id: string): Promise<boolean>
  getByType (type: string): Promise<any[]>
  setParent (context: ApplicationContext): void
  refresh (): Promise<void>
  close (): Promise<void>
}
