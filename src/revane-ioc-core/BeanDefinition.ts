import BeanOptions from './BeanOptions'

export default class BeanDefinition {
  public class: string
  public id: string
  public type: string
  public properties: any[]
  public loadAfter?: any[]
  public path: string
  public scope: string
  public options: BeanOptions = new BeanOptions()
  public instance?: any

  constructor (id: string) {
    this.id = id
  }
}
