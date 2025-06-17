import Bean from '../context/bean/Bean.js'
import ValueBean from '../context/bean/ValueBean.js'
import { DependencyResolver } from './DependencyResolver.js'
import { DependencyDefinition } from './DependencyDefinition.js'

export class ValueDependencyResolver implements DependencyResolver {
  public isRelevant (dependency: DependencyDefinition): boolean {
    return dependency.type === 'value'
  }

  public async resolve (dependency: DependencyDefinition): Promise<Bean> {
    return new ValueBean(dependency.value)
  }
}
