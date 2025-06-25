import ConflictingBeanDefinitionError from "./context/errors/BeanDefinedTwiceError.js";

export class BeanConflictChecker {
  beanDefinitions = new Map<string, boolean>();

  constructor() {}

  public check(id: string) {
    const exitingBeanDefininaton = this.beanDefinitions.get(id);
    if (exitingBeanDefininaton != null) {
      throw new ConflictingBeanDefinitionError(id);
    }
    this.beanDefinitions.set(id, true);
  }
}
