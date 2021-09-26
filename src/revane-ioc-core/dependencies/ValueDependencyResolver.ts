import Bean from '../context/bean/Bean'
import ValueBean from '../context/bean/ValueBean'
import { DependencyResolver } from './DependencyResolver'
import { DependencyDefinition } from './DependencyDefinition'

export class ValueDependencyResolver implements DependencyResolver {
  public isRelevant (dependency: DependencyDefinition): boolean {
    return dependency.type === 'value'
  }

  public async resolve (dependency: DependencyDefinition): Promise<Bean> {
    return new ValueBean(dependency.value)
  }
}
