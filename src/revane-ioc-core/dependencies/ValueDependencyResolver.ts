import Bean from '../context/bean/Bean'
import ValueBean from '../context/bean/ValueBean'
import { DependencyResolver } from './DependecyResolver'
import { Dependency } from './Dependency'

export class ValueDependencyResolver implements DependencyResolver {
  public isRelevant (dependency: Dependency): boolean {
    return dependency.type === 'value'
  }

  public async resolve (dependency: Dependency): Promise<Bean> {
    return new ValueBean(dependency.value)
  }
}
