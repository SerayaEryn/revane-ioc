import DefaultBeanDefinition from "../revane-ioc-core/DefaultBeanDefinition.js";
import { DependencyDefinition } from "../revane-ioc-core/dependencies/DependencyDefinition.js";
import { ALIAS_VALUE } from "../revane-ioc-core/Scopes.js";

export class AliasBeanDefinition extends DefaultBeanDefinition {
  constructor(id: string, targetId: string) {
    super(id);
    this.isAlias = true;
    this.scope = ALIAS_VALUE;
    this.dependencyIds = [new DependencyDefinition("bean", targetId, null)];
  }
}
