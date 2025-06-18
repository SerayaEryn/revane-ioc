import { randomBytes } from "crypto";

export function uid(): string {
  return randomBytes(32).toString("hex");
}
