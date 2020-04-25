import Context from './Context'

export class BeanProvider {
  private context: Context

  constructor (context: Context) {
    this.context = context
  }

  public get (id: string): any {
    return this.context.get(id)
  }
}
