import { Constructor } from '../../Constructor'

export default interface Bean {
  scope: string
  id: () => string
  init: () => Promise<any>
  getInstance: () => Promise<any>
  postConstruct: () => Promise<any>
  preDestroy: () => Promise<any>
  type: () => string
  classType: () => Constructor | undefined
}
