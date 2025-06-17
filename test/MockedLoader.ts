import { DependencyDefinition } from '../src/revane-ioc-core/dependencies/DependencyDefinition.js'
import Loader from '../src/revane-ioc-core/Loader.js'
import {
  BeanDefinition,
  DefaultBeanDefinition,
  Extension,
  LoaderOptions,
  Scopes
} from '../src/revane-ioc/RevaneIOC.js'

export function beanDefinition (id: string, classConstructor: any, dependencyIds: string[] = []): BeanDefinition {
  const beanDefinition = new DefaultBeanDefinition(id)
  beanDefinition.scope = Scopes.SINGLETON
  beanDefinition.classConstructor = classConstructor
  beanDefinition.dependencyIds = dependencyIds.map(it => { return new DependencyDefinition('bean', it, null) })
  return beanDefinition
}

export class MockedExtension extends Extension {
  constructor (private readonly beanDefinitions: BeanDefinition[]) {
    super()
  }

  public beanLoaders (): Loader[] {
    return [new MockedLoader(this.beanDefinitions)]
  }
}

class MockedLoader implements Loader {
  constructor (private readonly beanDefinitions: BeanDefinition[]) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async load (options: LoaderOptions[]): Promise<BeanDefinition[]> {
    return this.beanDefinitions
  }

  type (): string {
    return 'mock'
  }
}
