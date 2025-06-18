import { LoaderOptions, BeanDefinition } from "../revane-ioc/RevaneIOC.js";

export default interface Loader {
  load: (options: LoaderOptions[]) => Promise<BeanDefinition[]>;
  type: () => string;
}
