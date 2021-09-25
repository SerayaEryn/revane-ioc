import { BeanFactoryPreProcessor } from './BeanFactoryPreProcessor'
import { BeanDefinition } from '../BeanDefinition'
import { conditionalOnMissingBeanSym } from '../../revane-ioc/decorators/Symbols'

export class ConditionalsBeanFactoryPreProcessor implements BeanFactoryPreProcessor {
  public async preProcess (
    beanDefinition: BeanDefinition,
    beanDefinitions: BeanDefinition[]
  ): Promise<BeanDefinition[]> {
    const classConstructor = beanDefinition.classConstructor
    if (classConstructor == null) return [beanDefinition]
    const conditionalOnMissingBean = Reflect.getMetadata(conditionalOnMissingBeanSym, classConstructor)
    if (conditionalOnMissingBean === true) {
      const beanIsMissing = beanDefinitions.filter((it) => it.uid !== beanDefinition.uid)
        .filter((it) => it.id === beanDefinition.id)
        .length === 0
      if (beanIsMissing) {
        return [beanDefinition]
      } else {
        return []
      }
    }
    return [beanDefinition]
  }
}
