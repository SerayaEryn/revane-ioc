import { Logger } from "apheleia";

export interface LogFactory {
  getInstance: (id: string) => Logger;
}
