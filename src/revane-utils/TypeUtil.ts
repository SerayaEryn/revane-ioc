import { isAsyncFunction } from "node:util/types";

const CLASS = "class";

export function isFunction(value: any | null) {
  return typeof value === "function" || isAsyncFunction(value);
}

export function isClass(value: any | null) {
  return isFunction(value) && value.toString().trimStart().startsWith(CLASS);
}

export function isArray(value: any) {
  return Array.isArray(value);
}
