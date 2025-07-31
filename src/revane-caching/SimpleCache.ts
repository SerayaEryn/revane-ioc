import { Cache } from "./Cache.js";
import { ValueWrapper } from "./ValueWrapper.js";

export class SimpleCache implements Cache {
  #cache = new Map<any, any>();
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }

  has(key: any): boolean {
    return this.#cache.has(key);
  }

  clear(): void {
    this.#cache.clear();
  }

  evict(key: any): void {
    this.#cache.delete(key);
  }

  get(key: any): ValueWrapper {
    return this.#cache.get(key);
  }

  getName(): string {
    return this.#name;
  }

  put(key: any, value: any): void {
    this.#cache.set(key, new ValueWrapper(value));
  }
}
