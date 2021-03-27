import { Logger } from 'apheleia'

export interface LogFactory {
  getInstance: (clazz: any) => Logger
}
