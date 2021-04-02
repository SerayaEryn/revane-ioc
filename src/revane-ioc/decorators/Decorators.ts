import { createConditionalOnMissingBeanDecorator } from './ConditionalOnMissingBean'
import { createLifeCycleDecorator } from './LifeCycleDecorators'

const ConditionalOnMissingBean = createConditionalOnMissingBeanDecorator()
const PostConstruct = createLifeCycleDecorator('postConstruct')
const PreDestroy = createLifeCycleDecorator('preDestroy')

export {
  ConditionalOnMissingBean,
  PostConstruct,
  PreDestroy
}
