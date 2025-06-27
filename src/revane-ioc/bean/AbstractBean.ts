import { Constructor } from "../../revane-ioc-core/Constructor.js";
import Bean from "../../revane-ioc-core/context/bean/Bean.js";
import { BeanDefinition } from "../RevaneIOC.js";

export default abstract class AbstractBean implements Bean {
  public scope: string;

  constructor(
    protected beanDefinition: BeanDefinition,
    protected readonly postProcess: (
      bean: Bean,
      beanDefinition: BeanDefinition,
      instance: any,
    ) => Promise<void> = async () => {},
  ) {}

  public type(): string {
    return this.beanDefinition.type;
  }

  public classType(): Constructor | undefined {
    return this.beanDefinition.classConstructor;
  }

  public abstract id(): string;

  public abstract getInstance(): Promise<any>;

  public async createInstance(): Promise<any> {
    const parameters: any[] = [];
    for (const dependency of this.beanDefinition.dependencies) {
      parameters.push(await dependency.getInstance());
    }
    let instance: any = null;
    if (this.beanDefinition.instance != null) {
      instance = this.beanDefinition.instance;
    } else if (this.beanDefinition.isClass()) {
      if (this.beanDefinition.classConstructor == null) {
        throw new Error("cannot create instance because constructor is null");
      }
      instance = new this.beanDefinition.classConstructor(...parameters);
    } else {
      instance = this.beanDefinition.classConstructor;
    }
    await this.postProcess(this, this.beanDefinition, instance);
    return instance;
  }

  public abstract init(): Promise<void>;

  public async postConstruct(): Promise<any> {}

  public abstract preDestroy(): Promise<any>;
}
