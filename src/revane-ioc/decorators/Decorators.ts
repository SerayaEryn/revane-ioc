import { createConditionalOnMissingBeanDecorator } from "./ConditionalOnMissingBean.js";
import { createLifeCycleDecorator } from "./LifeCycleDecorators.js";

const ConditionalOnMissingBean = createConditionalOnMissingBeanDecorator();
const PostConstruct = createLifeCycleDecorator("postConstruct");
const PreDestroy = createLifeCycleDecorator("preDestroy");

export { ConditionalOnMissingBean, PostConstruct, PreDestroy };
