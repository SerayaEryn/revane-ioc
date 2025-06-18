import { randomBytes } from "node:crypto";

export function uid(): string {
  return randomBytes(32).toString("hex");
}
