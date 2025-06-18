import { ConfigurationPropertiesData } from "./ConfigurationProperties.js";

declare module "../revane-ioc-core/BeanDefinition.js" {
  interface BeanDefinition {
    configurationProperties?: ConfigurationPropertiesData;
  }
}
