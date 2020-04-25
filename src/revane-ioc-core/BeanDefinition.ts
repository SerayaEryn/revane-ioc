import BeanOptions from './BeanOptions'
import { Property } from './context/Container'

export default class BeanDefinition {
  public class: string
  public id: string
  public type: string
  public properties: Property[]
  public loadAfter?: Property[]
  public path: string
  public scope: string
  public options: BeanOptions = new BeanOptions()
  public instance?: any
  public configurationProperties?: any

  constructor (id: string) {
    this.id = id
  }
}
