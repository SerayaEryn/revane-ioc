import { uid } from '../../../revane-utils/Random'
import { Constructor } from '../../Constructor'
import Bean from './Bean'

export default class ValueBean implements Bean {
  public scope: string = 'value'
  private readonly value: any

  constructor (value: any) {
    this.value = value
  }

  public classType (): Constructor | undefined {
    return undefined
  }

  public id (): string {
    return uid()
  }

  public async init (): Promise<any> {
    // empty
  }

  public async getInstance (): Promise<any> {
    return this.value
  }

  public async postConstruct (): Promise<any> {
    // empty
  }

  public async preDestroy (): Promise<any> {
    // empty
  }

  public type (): string {
    return 'value'
  }
}
