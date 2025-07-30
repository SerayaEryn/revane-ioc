import { ValueWrapper } from "./ValueWrapper.js";

export interface Cache {
  getName(): string;
  get(key: any): ValueWrapper;
  put(key: any, value: any): void;
  evict(key: any): void;
  clear(): void;
}
