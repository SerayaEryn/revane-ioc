import Loader from '../src/revane-ioc-core/Loader'
import {
  BeanDefinition,
  DefaultBeanDefinition,
  Extension,
  LoaderOptions,
  Scopes
} from '../src/revane-ioc/RevaneIOC'

export function beanDefinition (id: string, classConstructor: any, dependencyIds: string[] = []): BeanDefinition {
  const beanDefinition = new DefaultBeanDefinition(id)
  beanDefinition.scope = Scopes.SINGLETON
  beanDefinition.classConstructor = classConstructor
  beanDefinition.dependencyIds = dependencyIds.map(it => { return { ref: it } })
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

  async load (options: LoaderOptions[]): Promise<BeanDefinition[]> {
    return this.beanDefinitions
  }

  type (): string {
    return 'mock'
  }
}
