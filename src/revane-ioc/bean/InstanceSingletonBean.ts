import SingletonBean from "./SingletonBean.js";
import { BeanDefinition } from "../RevaneIOC.js";

export default class SimpleSingletonBean extends SingletonBean {
  constructor(protected beanDefinition: BeanDefinition) {
    super(beanDefinition);
  }

  public id(): string {
    return this.beanDefinition.id;
  }

  public async init(): Promise<void> {}

  public async getInstance(): Promise<any> {
    return this.beanDefinition.instance;
  }

  public async postConstruct(): Promise<void> {}

  public async preDestroy(): Promise<void> {}
}
