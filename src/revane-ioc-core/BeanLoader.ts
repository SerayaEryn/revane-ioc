import Options from './Options'
import Loader from './Loader'
import { BeanDefinition } from './BeanDefinition'

export default class BeanLoader {
  constructor (private readonly loaders: Loader[]) {}

  public async getBeanDefinitions (options: Options): Promise<BeanDefinition[]> {
    const promises: Array<Promise<BeanDefinition[]>> = []
    const loaderOptions = options.loaderOptions
    for (const loader of this.loaders) {
      const loaderOptionsForType = loaderOptions.filter(it => it.type === loader.type())
      promises.push(loader.load(loaderOptionsForType))
    }
    const beanDefinitionsNonFlat = await Promise.all(promises)
    return beanDefinitionsNonFlat.flat()
  }
}
