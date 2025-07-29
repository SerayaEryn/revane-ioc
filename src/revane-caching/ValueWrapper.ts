export class ValueWrapper {
  #value: any | null;

  constructor(value: any | null) {
    this.#value = value;
  }

  get value(): any | null {
    return this.#value;
  }
}
