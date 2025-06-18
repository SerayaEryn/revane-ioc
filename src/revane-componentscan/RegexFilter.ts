import Filter from "./Filter.js";

export default class RegexFilter implements Filter {
  private readonly regex: RegExp;

  constructor(options: any) {
    this.regex = new RegExp(options.regex);
    this.applies = this.applies.bind(this);
  }

  public applies(clazz: string): boolean {
    return this.regex.test(clazz);
  }
}
