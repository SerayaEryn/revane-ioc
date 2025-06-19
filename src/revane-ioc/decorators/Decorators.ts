import { createLifeCycleDecorator } from "./LifeCycleDecorators.js";

const PostConstruct = createLifeCycleDecorator("postConstruct");
const PreDestroy = createLifeCycleDecorator("preDestroy");

export { PostConstruct, PreDestroy };
